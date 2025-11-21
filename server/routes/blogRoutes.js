import express from 'express';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublish,
  getBlogComments,
  addComments,
  generateContent
} from '../controllers/blogController.js';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.get('/all', getAllBlogs);

// IMPORTANT: register comments route (with param) BEFORE the generic '/:blogId'
blogRouter.get('/comments/:blogId', getBlogComments);
blogRouter.post('/add-comment', addComments);

blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/generate', auth, generateContent);

export default blogRouter;
