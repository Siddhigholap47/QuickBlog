import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

//import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets, blog_data, comments_data } from "../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null); // Blog details
  const [comments, setComments] = useState([]); // All comments
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // API: Fetch single blog by ID
  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // API: Fetch comments for this blog by ID
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/comments/${id}`);
      if(data.success){
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // API: Add comment
  const addComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
        fetchComments(); // refresh comments
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Fallback/Dummy: use local data in development (disable in prod or when API is ready)
  const useLocalDummy = false; // set true for testing without backend

  useEffect(() => {
    if (useLocalDummy) {
      const blog = blog_data.find((item) => item._id === id);
      setData(blog || null);
    } else {
      fetchBlogData();
    }
  }, [id]);

  useEffect(() => {
    if (useLocalDummy) {
      const filtered = comments_data.filter((item) => item.blog._id === id);
      setComments(filtered || []);
    } else {
      fetchComments();
    }
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      {/* Only the Navbar here!
      <Navbar />
      <div className="relative min-h-screen bg-gray-50">
        <img
          src={assets.gradientBackground}
          alt="Gradient"
          className="absolute top-0 left-0 w-full h-60 opacity-40 -z-10"
        />
         */}

        {/* Blog Header */}
        <div className="flex flex-col items-center py-12 px-4 text-center">
          <p className="text-sm text-blue-600 mb-2">
            Published on {moment(data.createdAt).format("MMMM Do, YYYY")}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">{data.title}</h1>
          <h2 className="text-xl md:text-2xl font-light text-slate-600 mb-2">{data.subTitle}</h2>
          <span className="text-base text-slate-400">By Admin</span>
        </div>
        {/* Blog Image */}
        <div className="flex justify-center my-6">
          <img
            src={data.image}
            alt={data.title}
            className="rounded-xl max-h-72 object-cover shadow-lg"
          />
        </div>
        {/* Blog Description */}
        <div
          className="rich-text max-w-3xl mx-auto px-4 py-2 text-left mb-8"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        {/* Comments Section */}
        <div className="max-w-2xl mx-auto mb-10">
          <p className="font-semibold text-lg mb-3">
            Comments ({comments.length})
          </p>
          <div className="flex flex-col gap-4 mb-6">
            {comments.map((item, i) => (
              <div
                className="border rounded-lg p-4 bg-white"
                key={i}
              >
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={assets.user_icon}
                    className="w-6"
                    alt="User"
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <p className="text-slate-700">{item.content}</p>
                <span className="block text-right text-xs text-gray-500 mt-1">
                  {moment(item.createdAt).fromNow()}
                </span>
              </div>
            ))}
          </div>
          {/* Add new comment */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <form className="flex flex-col gap-2" onSubmit={useLocalDummy ? (e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => {
                setComments([
                  ...comments,
                  {
                    name,
                    content,
                    createdAt: new Date().toISOString(),
                    blog: data,
                    isApproved: false
                  },
                ]);
                setName("");
                setContent("");
                setLoading(false);
              }, 1000);
            } : addComment}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 outline-none"
              />
              <textarea
                placeholder="Your comment..."
                value={content}
                required
                onChange={(e) => setContent(e.target.value)}
                className="border rounded px-3 py-2 outline-none resize-none"
                rows={3}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
    </>
  );

};

export default Blog;
