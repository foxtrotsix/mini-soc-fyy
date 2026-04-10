# GourmetHub Security Penetration Walkthrough
## Security Operations Center (SOC) Case Study

This document outlines the identified vulnerabilities and steps to reproduce them for educational purposes within the SOC project.

---

### 1. SQL Injection Bypass (Simulated)
**Vulnerability Type:** SQL Injection / Logic Bypass (A03:2021)
**Location:** `server.js` (`POST /api/login`)

**Step-by-step:**
1. Navigate to the `/login.html` page.
2. In the **Username** field, enter: `' OR '1'='1`
3. Enter anything in the **Password** field (e.g., `dummy`).
4. Click "Sign In".
5. **Observed Result:** You are logged in as the **first user** in the database (`admin`).
6. **Technical Reason:** The server uses a vulnerable `find` logic that mimics a SQL query where the `' OR '1'='1` string forces the expression to always return true, bypassing password verification.

---

### 2. Full XSS Defacement via Username
**Vulnerability Type:** Stored/DOM-based XSS (A03:2021)
**Location:** `public/index.html`

**Langkah Eksploitasi:**
1. Login menggunakan teknik Bypass di atas (atau login normal).
2. Setelah masuk, buka Console (F12) dan jalankan script ini untuk mengubah identitasmu menjadi elemen HTML:
   ```javascript
   localStorage.setItem('user', '<b style="color:red; font-size:1.5rem; text-shadow: 2px 2px black;">SYSTEM_HACKED</b>');
   location.reload();
   ```
3. **Hasil:** Teks "Welcome, ..." sekarang akan berubah menjadi merah tua, besar, dan memiliki bayangan. Ini membuktikan aplikasi merender input user secara mentah menggunakan `.innerHTML`.

---

### 3. DOM-based Script Execution
**Vulnerability Type:** Cross-Site Scripting (A03:2021)
**Location:** `public/js/app.js` (Cart Rendering)

**Langkah Eksploitasi:**
1. Masukkan payload script ke dalam data keranjang belanja melalui console:
   ```javascript
   localStorage.setItem('cart', JSON.stringify([{
       id: '999', 
       name: '<img src=x onerror="alert(\'SOC_ALERT: XSS_VULNERABILITY_DETECTED\')">', 
       img: 'https://placehold.co/100', 
       price: 0, 
       qty: 1
   }]));
   location.reload();
   ```
2. **Hasil:** Muncul pop-up alert "SOC_ALERT...". Ini menunjukkan penyerang bisa menjalankan script JavaScript apa saja di browser korban.


---

### 4. Insecure API Design (Missing Integrity)
**Vulnerability Type:** Lack of Server-Side Validation
**Location:** `/api/order` endpoint in `server.js`

**Step-by-step:**
1. Using a tool like Postman or the browser console, send a POST request to `/api/order`.
2. Provide a payload with a modified price or fake items.
3. **Observed Result:** The server responds with `Order placed successfully!` and logs the data without checking if the prices match the actual menu items.
4. **Technical Reason:** The server trusts the client-provided `cart` object entirely.

---

## Remediation Recommendations
- **Authentication:** Implement a real database (e.g., MongoDB/PostgreSQL) and use `bcrypt` for password hashing.
- **XSS:** Replace all `.innerHTML` calls with `.textContent` or use a sanitization library like `DOMPurify`.
- **Integrity:** Perform price calculations on the server side using a trusted product database, never trust prices sent from the client.
