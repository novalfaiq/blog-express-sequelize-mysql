const express = require('express');
const { User, Post, Preference } = require('./models');

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

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

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
