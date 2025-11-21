import express from 'express'
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin } from '../controllers/adminController.js'
import { getAllComments , getDashboard } from '../controllers/adminController.js'
import auth from '../middleware/auth.js'

const adminRouter = express.Router()

// Admin login route
adminRouter.post('/login', adminLogin)
adminRouter.get('/comments',auth , getAllComments);
adminRouter.get('/blogs',auth , getAllBlogsAdmin);
adminRouter.post('/delete-comment',auth , deleteCommentById);
adminRouter.post('/approve-comment',auth , approveCommentById);
adminRouter.get('/dashboard',auth , getDashboard);

export default adminRouter