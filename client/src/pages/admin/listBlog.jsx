import React, { useState, useEffect } from "react";
import moment from "moment";
import { blog_data } from "../../assets/assets"; // fallback/mock data
import BlogTableItem from "../../components/admin/blogTableItem";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios } = useAppContext(); // <-- call the hook

  // Fetch list from backend (admin endpoint)
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/admin/blogs");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message || "Could not fetch blogs");
      }
    } catch (error) {
      console.error("[fetchBlogs] ERROR:", error);
      toast.error(error?.response?.data?.message || error.message || "Network error");
      // fallback to local mock data so UI still shows something
      setBlogs(blog_data || []);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update a single blog in list (used by child to update status/delete)
  const replaceBlog = (updated) => {
    setBlogs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  const removeBlogLocal = (id) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Blogs</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-[800px] w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-semibold">#</th>
              <th className="p-4 text-left font-semibold">Blog Title</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No blogs found.
                </td>
              </tr>
            ) : (
              blogs.map((blog, idx) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  index={idx + 1}
                  onReplace={replaceBlog}
                  onRemove={() => removeBlogLocal(blog._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
