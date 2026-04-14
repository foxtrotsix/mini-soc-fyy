# Panduan Deployment Mini-SOC

Dokumen ini menjelaskan cara menjalankan Web Application ini di PC/Server lain dan cara mengonfigurasi Cloudflare Tunnel.

## 🚀 Langkah Menjalankan

1.  **Copy Folder Project**: Pastikan folder `mini-soc-new` sudah terkopi ke server tujuan.
2.  **Jalankan Docker Compose**:
    ```bash
    docker compose up -d --build
    ```

---

## ☁️ Setup Cloudflare Tunnel

Jika kamu ingin menggunakan domain sendiri melalui Cloudflare Tunnel secara gratis:

### 1. Install Cloudflared
Download dan install `cloudflared` di PC tersebut sesuai OS.

### 2. Login & Buat Tunnel
```bash
# Login ke akun Cloudflare
cloudflared tunnel login

# Buat tunnel baru (Ganti 'mini-soc-tunnel' bebas)
cloudflared tunnel create mini-soc-tunnel
```
Ini akan menghasilkan file JSON di folder `~/.cloudflared/`. Catat **Tunnel ID**-nya.

### 3. Konfigurasi DNS
Hubungkan domain/subdomain ke tunnel tersebut:
```bash
cloudflared tunnel route dns mini-soc-tunnel app.domain-kamu.com
```

### 4. Sinkronisasi Config
Update file `docker-compose.yml` bagian `tunnel` agar mengarah ke file JSON dan Tunnel ID yang baru kamu buat. Pastikan file `config.yml` di folder `.cloudflared` juga sesuai dengan domain baru (hanya mengarah ke `nginx:80`).

---

## 🔑 Akses
- **Web App**: Akses via port 80 (Nginx) atau via domain yang dikonfigurasi di Cloudflare Tunnel.
