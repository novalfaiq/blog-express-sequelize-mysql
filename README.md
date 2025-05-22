# Blog Express Sequelize MySQL

Aplikasi blog sederhana menggunakan Express.js, Sequelize, dan MySQL.

## Endpoint API

Proyek ini mengimplementasikan Eager Loading dan Lazy Loading dengan Sequelize.

### Eager Loading
Eager loading berarti memuat data terkait bersamaan dengan kueri utama. Ini berguna ketika Anda tahu Anda akan selalu membutuhkan data terkait tersebut, sehingga mengurangi jumlah kueri ke database.

- `GET /users`: Mendapatkan semua pengguna beserta semua `Post` dan `Preference` mereka (Contoh Eager Loading).

### Lazy Loading
Lazy loading berarti data terkait dimuat hanya ketika benar-benar dibutuhkan, biasanya setelah kueri awal dieksekusi. Ini bisa lebih efisien jika data terkait tidak selalu diperlukan.

- `GET /users/:userId`: Mendapatkan pengguna berdasarkan ID, kemudian `Post` dan `Preference` pengguna tersebut akan dimuat secara terpisah (Contoh Lazy Loading).
- `GET /posts/:postId`: Mendapatkan post berdasarkan ID, kemudian `User` yang terkait dengan post tersebut akan dimuat secara terpisah (Contoh Lazy Loading).

### User
- `POST /users` - Membuat pengguna baru
- `GET /users` - Mendapatkan semua pengguna beserta post dan preferensi mereka (Eager Loading)
- `GET /users/:userId` - Mendapatkan pengguna berdasarkan ID beserta post dan preferensi mereka (Lazy Loading)
- `DELETE /users/:userId` - Melakukan soft delete pada pengguna
- `GET /users/deleted` - Mendapatkan daftar pengguna yang sudah di-soft delete
- `POST /users/:userId/restore` - Mengembalikan (restore) pengguna yang sudah di-soft delete

### Post
- `POST /users/:userId/posts` - Membuat post baru untuk pengguna tertentu
- `GET /posts` - Mendapatkan semua post beserta informasi pengguna (Eager Loading pada User)
- `GET /posts/:postId` - Mendapatkan post berdasarkan ID beserta informasi pengguna (Lazy Loading pada User)

### Preference
- `POST /preferences` - Membuat preferensi baru
- `GET /preferences` - Mendapatkan semua preferensi
- `POST /users/:userId/preferences/:preferenceId` - Menambahkan preferensi ke pengguna

## Cara Menjalankan

1. Pastikan MySQL sudah berjalan (gunakan Docker Compose)
   ```
   docker-compose up -d
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Jalankan migrasi database
   ```
   npx sequelize-cli db:migrate
   ```

4. Jalankan aplikasi
   ```
   node index.js
   ```

5. Akses API di http://localhost:3000