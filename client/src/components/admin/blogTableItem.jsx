import React, { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

const BlogTableItem = ({ blog, index, onReplace, onRemove }) => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Local state for instant UI updates
  const [isPublished, setIsPublished] = useState(blog.isPublished);

  // Toggle Publish / Unpublish
  const togglePublish = async () => {
    try {
      setLoading(true);

      // instantly update UI
      const newStatus = !isPublished;
      setIsPublished(newStatus);

      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      if (data.success) {
        toast.success(newStatus ? "Published" : "Unpublished");

        // send updated row to parent
        if (onReplace) {
          onReplace({ ...blog, isPublished: newStatus });
        }
      } else {
        toast.error(data.message);
        setIsPublished(!newStatus); // revert UI if failed
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      setIsPublished((prev) => !prev); // revert UI
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async () => {
    const ok = window.confirm("Are you sure you want to delete this blog?");
    if (!ok) return;

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });

      if (data.success) {
        toast.success("Blog deleted");
        if (onRemove) onRemove(blog._id);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td className="px-2 py-4 text-center">{index}</td>

      <td className="px-2 py-4 flex items-center gap-2">
        <img
          src={blog.image}
          alt="Blog"
          className="w-10 h-8 object-cover rounded border"
        />
        <span className="font-medium">{blog.title}</span>
      </td>

      <td className="px-2 py-4 text-center">
        {moment(blog.createdAt).format("MMM DD, YYYY")}
      </td>

      <td className="px-2 py-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isPublished
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </td>

      <td className="px-2 py-4 flex justify-center items-center gap-3">
        <button
          onClick={togglePublish}
          disabled={loading}
          className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={deleteBlog}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border rounded text-red-600 hover:bg-red-50"
          title="Delete"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

export default BlogTableItem;
