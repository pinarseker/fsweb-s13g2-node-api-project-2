// posts için gerekli routerları buraya yazın
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();


router.get('/', async (_req, res) => {
  try {
    const all = await Posts.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: 'Gönderiler alınamadı' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi bilgisi alınamadı' });
  }
});


router.post('/', async (req, res) => {
  const { title, contents } = req.body || {};
  if (
    typeof title !== 'string' || title.trim() === '' ||
    typeof contents !== 'string' || contents.trim() === ''
  ) {
    return res
      .status(400)
      .json({ message: 'Lütfen gönderi için bir title ve contents sağlayın' });
  }
  try {
    const { id } = await Posts.insert({
      title: title.trim(),
      contents: contents.trim(),
    }); 
    const created = await Posts.findById(id);
    res.status(201).json(created);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Veritabanına kaydedilirken bir hata oluştu' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const existing = await Posts.findById(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    const { title, contents } = req.body || {};
    if (
      typeof title !== 'string' || title.trim() === '' ||
      typeof contents !== 'string' || contents.trim() === ''
    ) {
      return res
        .status(400)
        .json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
    }

    await Posts.update(req.params.id, {
      title: title.trim(),
      contents: contents.trim(),
    });
    const updated = await Posts.findById(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi bilgileri güncellenemedi' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const toDelete = await Posts.findById(req.params.id);
    if (!toDelete) {
      return res
        .status(404)
        .json({ message: 'Belirtilen ID li gönderi bulunamadı' });
    }
    await Posts.remove(req.params.id);
    res.json(toDelete);
  } catch (err) {
    res.status(500).json({ message: 'Gönderi silinemedi' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Girilen ID'li gönderi bulunamadı." });
    }
    const comments = await Posts.findPostComments(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Yorumlar bilgisi getirilemedi' });
  }
});

module.exports = router;