# 🎵 Sistem Audio Kontinu FISLAB

Sistem ini memungkinkan musik background berputar secara kontinu saat pengguna berpindah antar halaman website FISLAB.

## ✨ Fitur Utama

- **Musik Kontinu**: Musik terus berputar saat berpindah halaman
- **Posisi Terjaga**: Musik melanjutkan dari posisi terakhir
- **Volume Konsisten**: Pengaturan volume tersimpan antar halaman
- **Service Worker**: Dukungan untuk caching dan state management
- **Responsive**: Bekerja di semua perangkat dan browser modern

## 🚀 Cara Implementasi

### 1. File yang Diperlukan

Pastikan file berikut ada di folder `Web Fislab 1/`:

```
Web Fislab 1/
├── audio-manager.js          # Manager audio utama
├── audio-service-worker.js   # Service worker untuk kontinuitas
├── audio-control.js          # Kontrol audio dasar (opsional)
└── Lagu/
    └── The Land of Her Serenity - Yu-Peng Chen.mp3
```

### 2. Tambahkan ke HTML

Tambahkan script berikut ke setiap halaman HTML yang ingin memiliki audio kontinu:

```html
<!-- Di bagian <head> atau sebelum </body> -->
<script src="audio-manager.js"></script>
```

### 3. Struktur HTML Minimal

Setiap halaman HTML harus memiliki struktur dasar:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nama Halaman</title>
</head>
<body>
    <!-- Konten halaman -->
    
    <!-- Script audio -->
    <script src="audio-manager.js"></script>
</body>
</html>
```

## 🔧 Cara Kerja

### 1. State Management
- Audio state disimpan di `localStorage`
- Posisi, volume, dan status play tersimpan
- State di-restore saat kembali ke halaman

### 2. Service Worker
- Mengelola audio state di background
- Sinkronisasi antar tab/window
- Caching file audio untuk performa

### 3. Page Navigation
- State disimpan sebelum navigasi
- State di-restore setelah navigasi
- Delay minimal untuk smooth transition

## 📱 Penggunaan

### Kontrol Dasar
```javascript
// Play musik
window.fislabAudio.play();

// Pause musik
window.fislabAudio.pause();

// Toggle play/pause
window.fislabAudio.toggle();

// Set volume (0.0 - 1.0)
window.fislabAudio.setVolume(0.7);

// Seek ke posisi tertentu (dalam detik)
window.fislabAudio.seekTo(30);
```

### Informasi Audio
```javascript
// Cek status
const isPlaying = window.fislabAudio.getPlayingState();

// Dapatkan posisi saat ini
const currentTime = window.fislabAudio.getCurrentTime();

// Dapatkan durasi
const duration = window.fislabAudio.getDuration();

// Cek apakah audio siap
const isReady = window.fislabAudio.isReady();
```

## 🎨 Kustomisasi

### 1. Ganti File Audio
Edit file `audio-manager.js` dan ubah path audio:

```javascript
source.src = 'Lagu/nama-file-anda.mp3';
```

### 2. Ubah Posisi Tombol
Edit CSS di `audio-manager.js`:

```css
.audio-control {
    position: fixed;
    top: 6px;        /* Posisi dari atas */
    right: 60px;     /* Posisi dari kanan */
    /* ... */
}
```

### 3. Tambah Fitur Baru
Extend class `AudioManager` dengan method baru:

```javascript
class AudioManager {
    // ... existing code ...
    
    // Method baru
    fadeIn(duration = 1000) {
        // Implementasi fade in
    }
    
    fadeOut(duration = 1000) {
        // Implementasi fade out
    }
}
```

## 🧪 Testing

### 1. File Test
Gunakan `audio-test.html` untuk testing:

1. Buka `audio-test.html`
2. Klik tombol Play
3. Navigasi ke halaman lain
4. Kembali ke test page
5. Verifikasi musik melanjutkan dari posisi terakhir

### 2. Manual Testing
1. Buka halaman dengan audio
2. Play musik
3. Navigasi ke halaman lain
4. Kembali ke halaman awal
5. Cek apakah musik masih berputar

## 🔍 Troubleshooting

### Masalah Umum

#### 1. Audio Tidak Berputar
- Pastikan user sudah berinteraksi dengan halaman
- Cek console untuk error
- Verifikasi path file audio benar

#### 2. State Tidak Tersimpan
- Cek apakah localStorage tersedia
- Pastikan service worker ter-register
- Verifikasi permission browser

#### 3. Audio Terputus Saat Navigasi
- Pastikan delay navigasi cukup (100ms+)
- Cek event listener berfungsi
- Verifikasi state saving berjalan

### Debug Mode
Aktifkan debug dengan menambahkan ke console:

```javascript
// Enable debug logging
localStorage.setItem('fislab-audio-debug', 'true');

// Check audio state
console.log('Audio State:', localStorage.getItem('fislab-audio-state'));
```

## 🌐 Browser Support

- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+
- ❌ Internet Explorer (tidak support service worker)

## 📝 Changelog

### v2.0.0 (Current)
- Service worker integration
- Cross-page communication
- Enhanced state management
- Better error handling

### v1.0.0
- Basic localStorage persistence
- Simple audio controls
- Page transition handling

## 🤝 Kontribusi

Untuk berkontribusi atau melaporkan bug:

1. Fork repository
2. Buat branch fitur
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

Sistem ini dibuat untuk website FISLAB. Silakan gunakan dan modifikasi sesuai kebutuhan.

---

**Catatan**: Pastikan file audio memiliki format yang didukung (MP3, WAV, OGG) dan ukuran yang reasonable untuk performa optimal.
