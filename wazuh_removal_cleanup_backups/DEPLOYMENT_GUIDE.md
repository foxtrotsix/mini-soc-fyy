# Panduan Deployment Mini-SOC & Wazuh

Dokumen ini menjelaskan cara menjalankan stack Docker ini di PC/Server lain dan cara mengonfigurasi Cloudflare Tunnel dari nol.

## 📋 Persiapan Host (Wajib)

Wazuh Indexer membutuhkan batas memori virtual yang lebih tinggi di sisi host Linux. Jalankan perintah ini di terminal PC target:

```bash
# Set sementara
sudo sysctl -w vm.max_map_count=262144

# Set permanen (opsional tapi disarankan)
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```

## 🚀 Langkah Menjalankan (PC Baru)

1.  **Copy Seluruh Folder Project**: Pastikan folder `mini-soc-new` dan folder `wazuh-docker` (beserta isinya) sudah terkopi.
2.  **Jalankan Docker Compose**:
    ```bash
    docker compose up -d --build
    ```
3.  **Inisialisasi Keamanan (Hanya sekali saat pertama kali instal)**:
    Tunggu sekitar 2 menit setelah kontainer nyala, lalu jalankan perintah ini untuk mengaktifkan database keamanan:
    ```bash
    docker exec mini-soc-new-wazuh-indexer-1 bash -c "export JAVA_HOME=/usr/share/wazuh-indexer/jdk && bash /usr/share/wazuh-indexer/plugins/opensearch-security/tools/securityadmin.sh -cd /usr/share/wazuh-indexer/opensearch-security/ -icl -nhnv -cacert /usr/share/wazuh-indexer/certs/root-ca.pem -cert /usr/share/wazuh-indexer/certs/admin.pem -key /usr/share/wazuh-indexer/certs/admin-key.pem -h localhost"
    ```

---

## ☁️ Setup Cloudflare Tunnel (Tanpa Kartu Kredit)

Jika kamu ingin menggunakan domain sendiri melalui Cloudflare Tunnel secara gratis:

### 1. Install Cloudflared
Download dan install `cloudflared` di PC tersebut sesuai OS.

### 2. Login & Buat Tunnel
```bash
# Login ke akun Cloudflare
cloudflared tunnel login

# Buat tunnel baru (Ganti 'nama-tunnel' bebas)
cloudflared tunnel create wazuh-monitor
```
Ini akan menghasilkan file JSON di folder `~/.cloudflared/`. Catat **Tunnel ID**-nya.

### 3. Konfigurasi DNS
Hubungkan domain/subdomain ke tunnel tersebut:
```bash
cloudflared tunnel route dns wazuh-monitor app.domain-kamu.com
cloudflared tunnel route dns wazuh-monitor wazuh.domain-kamu.com
```

### 4. Sinkronisasi Config
Update file `docker-compose.yml` bagian `tunnel` agar mengarah ke file JSON dan Tunnel ID yang baru kamu buat. Pastikan file `config.yml` di folder `.cloudflared` juga sesuai dengan domain baru.

---

## 🔑 Kredensial Default
- **Web App**: Akses via port 80 (Nginx)
- **Wazuh Dashboard**: 
  - **User**: `admin`
  - **Password**: `SecretPassword`
- **Wazuh API**:
  - **User**: `admin`
  - **Password**: `SecretPassword`

> [!IMPORTANT]
> Pastikan PC target memiliki RAM minimal **8GB** karena stack Wazuh cukup berat saat pertama kali dijalankan.
