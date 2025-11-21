import fs from "fs";
import mongoose from "mongoose";
import ImageKit from "imagekit";
import Blog from "../models/Blog.js";
import Comment from "../models/comments.js";
import main from "../configs/gemini.js";

// --------------------------- ImageKit Setup ---------------------------
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

// --------------------------- ADD BLOG ---------------------------
export const addBlog = async (req, res) => {
  try {
    if (!req.body.blog) {
      return res.status(400).json({ success: false, message: "Missing 'blog' field." });
    }

    let blogData = JSON.parse(req.body.blog);

    const { title, subTitle, description, category, isPublished } = blogData;
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploaded = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    const optimizedImageUrl = imagekit.url({
      path: uploaded.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }]
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.error("[addBlog] ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- GET ALL BLOGS ---------------------------
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- GET SINGLE BLOG ---------------------------
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --------------------------- DELETE BLOG ---------------------------
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- TOGGLE PUBLISH ---------------------------
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- ADD COMMENT ---------------------------
export const addComments = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    if (!mongoose.isValidObjectId(blog))
      return res.status(400).json({ success: false, message: "Invalid blog ID." });

    const created = await Comment.create({ blog, name, content });

    res.json({ success: true, message: "Comment added for review", comment: created });
  } catch (error) {
    console.error("[addComments] ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- GET COMMENTS ---------------------------
export const getBlogComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).json({ success: false, message: "Invalid blog ID." });

    const comments = await Comment.find({ blog: blogId, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, comments });
  } catch (error) {
    console.error("[getBlogComments] ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + ' Generate a blog content for this topic in simple text format'
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
