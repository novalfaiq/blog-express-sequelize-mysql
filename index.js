const express = require('express');
const { User, Post, Preference } = require('./models');

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Contoh eager loading: Mengambil semua user dan posts dengan relasi post dan preference
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Post }, // relasi post
        { model: Preference } // relasi preference many-to-many
      ]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/users/:userId/posts', async (req, res) => {
  const post = await Post.create({ ...req.body, UserId: req.params.userId });
  res.json(post);
});

app.get('/posts', async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.json(posts);
});

// Controller untuk menambahkan preferensi baru
const addPreference = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nama preferensi diperlukan' });
    }
    
    const preference = await Preference.create({ name });
    res.status(201).json(preference);
  } catch (error) {
    console.error('Error saat menambahkan preferensi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan preferensi' });
  }
};

// Controller untuk menambahkan preferensi ke pengguna
const addUserPreference = async (req, res) => {
  try {
    const { userId, preferenceId } = req.params;
    
    // Cek apakah user dan preference ada
    const user = await User.findByPk(userId);
    const preference = await Preference.findByPk(preferenceId);
    
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    if (!preference) {
      return res.status(404).json({ message: 'Preferensi tidak ditemukan' });
    }
    
    // Tambahkan preferensi ke user
    await user.addPreference(preference);
    
    // Ambil semua preferensi user setelah penambahan
    const userWithPreferences = await User.findByPk(userId, {
      include: [{ model: Preference }]
    });
    
    res.status(200).json(userWithPreferences);
  } catch (error) {
    console.error('Error saat menambahkan preferensi ke pengguna:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan preferensi ke pengguna' });
  }
};

// Controller untuk mendapatkan semua preferensi
const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findAll();
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error saat mengambil preferensi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil preferensi' });
  }
};

// Endpoint untuk preferensi
app.post('/preferences', addPreference);
app.get('/preferences', getAllPreferences);
app.post('/users/:userId/preferences/:preferenceId', addUserPreference);

// Contoh Lazy Loading: Mendapatkan pengguna berdasarkan ID, lalu memuat posts dan preferences secara terpisah
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Lazy load posts
    const posts = await user.getPosts();
    // Lazy load preferences
    const preferences = await user.getPreferences();

    res.json({ ...user.toJSON(), Posts: posts, Preferences: preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pengguna' });
  }
});

// Contoh Lazy Loading: Mendapatkan post berdasarkan ID, lalu memuat user terkait
app.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    // Lazy load user
    const user = await post.getUser();

    res.json({ ...post.toJSON(), User: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data post' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
