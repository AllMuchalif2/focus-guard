# Focus Guard 🛡️

**AI-Powered Pomodoro Focus Tool**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=netlify)](https://focus-guard-ai.netlify.app/)

**Focus Guard** adalah aplikasi web produktivitas yang menggabungkan teknik Pomodoro dengan kecerdasan buatan (AI). Aplikasi ini menggunakan kamera laptop/webcam Anda untuk mendeteksi keberadaan ponsel (HP). Jika Anda terganggu dan memegang HP saat sesi fokus berlangsung, alarm akan berbunyi untuk mengingatkan Anda agar kembali bekerja.

## ✨ Fitur Utama

* **Deteksi HP Otomatis**: Menggunakan `ml5.js` (model CocoSSD) untuk mendeteksi objek "cell phone" secara real-time melalui webcam.
* **Smart Pomodoro Timer**: Timer fokus yang dapat disesuaikan (default: 25 menit).
* **Sistem Peringatan**:
    * Visual: Overlay peringatan merah saat HP terdeteksi.
    * Audio: Memutar suara peringatan (`sound.mp3`).
    * Notifikasi: Mengirim notifikasi desktop jika browser diminimize.
* **Progressive Web App (PWA)**: Dapat diinstal di perangkat (desktop/mobile) dan berjalan secara *offline* berkat Service Worker.
* **Desain Neo-Brutalism**: Antarmuka pengguna yang unik menggunakan Tailwind CSS.

## 🚀 Demo

Coba aplikasi secara langsung di sini:
**[https://focus-guard-ai.netlify.app/](https://focus-guard-ai.netlify.app/)**

## 🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan Vanilla JavaScript (ES Modules) tanpa *build step* yang rumit.

* **Core**: HTML5, JavaScript (ES6+).
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN).
* **AI/ML**: [ml5.js](https://ml5js.org/) (berbasis TensorFlow.js) untuk deteksi objek.
* **PWA**: Service Worker & Web Manifest untuk dukungan offline dan instalasi.

## 📂 Struktur Proyek

```text
focus-guard/
├── index.html          # Entry point & UI Layout
├── manifest.json       # Konfigurasi PWA
├── sw.js               # Service Worker (Caching & Offline support)
├── icon.svg            # Logo aplikasi
├── sound.mp3           # Efek suara peringatan
└── src/
    ├── app.js          # Logika utama (Main entry)
    ├── config.js       # Konfigurasi global (Threshold AI, Timer settings)
    ├── detector.js     # Wrapper class untuk ml5.js object detection
    ├── notification.js # Manager untuk audio & desktop notifications
    ├── timer.js        # Class logika Countdown timer
    └── ui.js           # Manipulasi DOM dan update tampilan

```

## 💻 Cara Menjalankan di Lokal

Karena aplikasi ini memerlukan akses kamera (`getUserMedia`) dan Service Worker, aplikasi ini **harus** dijalankan melalui protokol HTTPS atau `localhost`. Membuka `index.html` secara langsung (protokol `file://`) tidak akan bekerja.

### Prasyarat

Pastikan Anda memiliki text editor seperti VS Code.

### Langkah-langkah

1. **Clone repositori ini** (atau unduh ZIP):
```bash
git clone https://github.com/AllMuchalif2/focus-guard
cd focus-guard

```


2. **Jalankan Local Server**:
Cara termudah adalah menggunakan ekstensi **Live Server** di VS Code.
* Buka folder project di VS Code.
* Klik kanan pada `index.html`.
* Pilih "Open with Live Server".


3. **Buka di Browser**:
Buka `http://localhost:5500` (atau port yang sesuai) di browser Chrome/Edge/Firefox.
4. **Izinkan Akses**:
Berikan izin browser untuk mengakses **Kamera** dan **Notifikasi** agar fitur AI berjalan normal.

## ⚙️ Konfigurasi

Anda dapat mengubah pengaturan dasar di file `src/config.js`:

```javascript
export const CONFIG = {
  CONFIDENCE_THRESHOLD: 0.6, // Sensitivitas AI (0.1 - 1.0)
  NOTIFICATION_COOLDOWN_MS: 10000, // Jeda antar notifikasi
  DEFAULT_TIMER_MINUTES: 25, // Durasi default pomodoro
};

```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *Pull Request* untuk fitur baru atau perbaikan bug.

1. Fork repositori ini.
2. Buat branch fitur (`git checkout -b fitur-keren`).
3. Commit perubahan Anda (`git commit -m 'Menambah fitur keren'`).
4. Push ke branch (`git push origin fitur-keren`).
5. Buka Pull Request.

## 📝 Lisensi

[MIT License](https://www.google.com/search?q=LICENSE) - Bebas untuk digunakan dan dimodifikasi.

```
