# Fitur Audio Control - FISLAB Website

## Deskripsi
Fitur backsound telah ditambahkan ke semua halaman website FISLAB dengan kontrol audio yang mudah digunakan. Fitur ini menggunakan file audio "The Land of Her Serenity - Yu-Peng Chen.mp3" yang tersedia di folder `Lagu/`.

## Fitur Utama

### 1. Button Speaker On/Off
- **Lokasi**: Pojok kanan atas setiap halaman
- **Desain**: Button bulat dengan icon speaker yang berubah sesuai status
- **Fungsi**: 
  - Icon speaker on (🔊) = audio sedang diputar
  - Icon speaker off (🔇) = audio sedang dihentikan

### 2. Kontrol Audio
- **Play/Pause**: Klik button untuk memulai/menghentikan audio
- **Loop**: Audio akan berputar berulang secara otomatis
- **Volume**: Volume audio dapat diatur melalui browser

### 3. Persistensi Status
- Status audio (play/pause) disimpan di localStorage
- Ketika user berpindah halaman, status audio tetap terjaga
- Audio akan otomatis dimulai jika sebelumnya sedang diputar

## Implementasi Teknis

### File yang Ditambahkan
- `audio-control.js` - Script utama untuk kontrol audio
- `README_AUDIO.md` - Dokumentasi ini

### Halaman yang Sudah Diupdate
- `index.html` - Halaman login
- `home.html` - Halaman utama
- `jadwal.html` - Halaman jadwal
- `kontak.html` - Halaman kontak
- `nilai.html` - Halaman nilai
- `penilaian.html` - Halaman penilaian
- `modul.html` - Halaman modul

### Cara Kerja
1. **Auto-initialization**: Script otomatis berjalan saat halaman dimuat
2. **Dynamic Creation**: Button dan elemen audio dibuat secara dinamis
3. **Event Handling**: Menggunakan event listener untuk kontrol audio
4. **State Management**: Status audio disimpan dan dipulihkan dari localStorage

## Penggunaan

### Untuk User
1. Buka website FISLAB
2. Lihat button speaker di pojok kanan atas
3. Klik button untuk memulai/menghentikan audio
4. Audio akan berputar di background sambil browsing

### Untuk Developer
1. Pastikan file `audio-control.js` ada di root folder website
2. Pastikan file audio MP3 ada di folder `Lagu/`
3. Tambahkan script tag ke halaman HTML baru:
   ```html
   <script src="audio-control.js"></script>
   ```

## Customization

### Mengubah Audio
- Ganti file audio di folder `Lagu/`
- Update path di `audio-control.js` line 47:
  ```javascript
  source.src = 'Lagu/nama_file_audio_baru.mp3';
  ```

### Mengubah Posisi Button
- Edit CSS di `audio-control.js` line 108-120:
  ```css
  .audio-control {
      position: fixed;
      top: 20px;      /* Jarak dari atas */
      right: 20px;    /* Jarak dari kanan */
      /* ... */
  }
  ```

### Mengubah Volume Default
- Tambahkan di `audio-control.js` setelah inisialisasi:
  ```javascript
  window.fislabAudio.setVolume(0.5); // Volume 50%
  ```

## Browser Support
- Chrome 66+
- Firefox 60+
- Safari 11.1+
- Edge 79+

## Troubleshooting

### Audio Tidak Berputar
1. Pastikan browser mendukung autoplay
2. Cek console browser untuk error
3. Pastikan file audio ada dan dapat diakses

### Button Tidak Muncul
1. Pastikan `audio-control.js` dimuat dengan benar
2. Cek console browser untuk error JavaScript
3. Pastikan tidak ada konflik CSS

### Status Audio Tidak Tersimpan
1. Pastikan localStorage tersedia di browser
2. Cek console browser untuk error
3. Pastikan script berjalan setelah DOM ready

## Lisensi
Fitur ini dikembangkan khusus untuk website FISLAB. File audio "The Land of Her Serenity" adalah karya Yu-Peng Chen.

## Kontak
Untuk pertanyaan atau masalah teknis, silakan hubungi tim pengembang FISLAB.
