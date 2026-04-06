const Post = require('../models/Posts');

exports.createPost = async (req, res) => {
    const newPost = new Post({
        content: req.body.content,
        imageURL: req.body.imageURL,
        user: req.user.id
    });

    const post = await newPost.save();
    res.status(201).json(post);
};

exports.getFeed = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', ['fullName', 'role']);
    res.json(posts);
};

exports.toggleLike = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some(like => like.user.toString() === req.user.id);
    if (!alreadyLiked) {
        post.likes.unshift({ user: req.user.id });
    } else {
        post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    }
    await post.save();
    res.json(post.likes);
};