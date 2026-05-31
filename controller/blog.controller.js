import { Blog } from '../models/index.js';

// @desc    Get all blogs
// @route   GET /api/blogs
export const getBlogs = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 9, featured } = req.query;
    const q = { isPublished: true };
    if (category) q.category = category;
    if (featured === 'true') q.isFeatured = true;
    const total = await Blog.countDocuments(q);
    const blogs = await Blog.find(q)
      .select('title slug excerpt category image author createdAt views isFeatured')
      .populate('author', 'name avatar')
      .sort('-isFeatured -createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    res.json({ success: true, total, pages: Math.ceil(total / parseInt(limit)), data: blogs });
  } catch (e) {
    next(e);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name avatar')
      .populate('relatedBlogs', 'title slug image category createdAt');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    res.json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
};
