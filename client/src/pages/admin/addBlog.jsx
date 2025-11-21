import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { blogCategories } from "../../assets/assets";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import {parse} from 'marked'

const AddBlog = () => {
  const { axios } = useAppContext();
  const quillRef = useRef();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState(blogCategories[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  // Generate content using AI (if needed)
  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", { prompt: title });
      if (data.success) {
        setDescription(data.content);  // Set AI-generated content
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit handler for the form
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Please upload an image");

    try {
      setIsAdding(true);

      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("You are not logged in!");
      }

      const blog = {
        title,
        subTitle,
        description,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setTitle("");
        setSubTitle("");
        setDescription("");
        setCategory(blogCategories[0]);
        setImage(null);
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto bg-white p-6 mt-6 rounded shadow"
      onSubmit={onSubmitHandler}
    >
      <h1 className="text-2xl mb-4 font-bold">Add New Blog</h1>

      {/* Upload Thumbnail */}
      <label className="block font-medium mb-1">Upload Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        className="block border mb-3"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      {/* Blog Title */}
      <input
        type="text"
        placeholder="Blog Title"
        className="border rounded w-full px-3 py-2 mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Blog Subtitle */}
      <input
        type="text"
        placeholder="Subtitle"
        className="border rounded w-full px-3 py-2 mb-3"
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
        required
      />

      {/* Generate Content Button */}
      <button
        type="button"
        onClick={generateContent}
        className="bg-emerald-500 text-white rounded px-3 py-1 mb-3 mr-2 hover:bg-emerald-600 disabled:opacity-50"
        disabled={loading}
        style={{ marginBottom: '1rem' }}
      >
        {loading ? "Generating..." : "Generate Content with AI"}
      </button>

      {/* Blog Content - ReactQuill */}
      <ReactQuill
        ref={quillRef}
        value={description}
        onChange={setDescription}
        theme="snow"
        className="mb-3"
      />

      {/* Category */}
      <select
        className="border rounded w-full px-3 py-2 mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {blogCategories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      {/* Publish checkbox */}
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="mr-2"
        />
        <span>Publish Now</span>
      </div>

      {/* Button */}
      <button
        disabled={isAdding}
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {isAdding ? "Adding..." : "Add Blog"}
      </button>
    </form>
  );
};

export default AddBlog;
