const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  featuredImage: { type: String },    // if implementing image upload
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { createPostValidator, updatePostValidator } = require('../validators/postValidator');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', createPostValidator, postController.createPost);
router.put('/:id', updatePostValidator, postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;

const Post = require('../models/Post');

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// … likewise other handlers (getPostById, createPost, updatePost, deletePost)

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};
