import React, { useState, useEffect } from "react";
import moment from "moment";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved"); // default tab
  const { axios } = useAppContext();

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const { data } = await axios.get("/api/admin/comments");
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Approve comment
  const approveComment = async (id) => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", { id });
      if (data.success) {
        toast.success("Comment Approved");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { data } = await axios.post("/api/admin/delete-comment", { id });
      if (data.success) {
        toast.success("Comment Deleted");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Filtering logic
  const filteredComments =
    filter === "Approved"
      ? comments.filter((c) => c.isApproved)
      : comments.filter((c) => !c.isApproved);

  return (
    <div className="p-6 flex-1">
      <h1 className="text-xl font-bold mb-6">Comments</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("Approved")}
          className={`px-4 py-2 rounded ${
            filter === "Approved"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("Not Approved")}
          className={`px-4 py-2 rounded ${
            filter === "Not Approved"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Not Approved
        </button>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded shadow px-2 py-4">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left font-semibold">
                BLOG TITLE & COMMENT
              </th>
              <th className="p-2 font-semibold">DATE</th>
              <th className="p-2 font-semibold">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No comments found.
                </td>
              </tr>
            ) : (
              filteredComments.map((comment) => (
                <tr key={comment._id} className="border-b">
                  <td className="p-2">
                    <p>
                      <b>Blog :</b>{" "}
                      <span className="text-blue-600">
                        {comment.blog?.title || "Untitled"}
                      </span>
                    </p>
                    <p>
                      <b>Name :</b> {comment.name}
                    </p>
                    <p>
                      <b>Comment :</b> {comment.content}
                    </p>
                  </td>

                  <td className="p-2 text-center">
                    {moment(comment.createdAt).format("MM/DD/YYYY")}
                  </td>

                  <td className="p-2 text-center flex gap-3 justify-center">
                    {!comment.isApproved && (
                      <button
                        title="Approve"
                        onClick={() => approveComment(comment._id)}
                        className="text-green-600 hover:text-green-800 text-xl"
                      >
                        ✔️
                      </button>
                    )}

                    <button
                      title="Delete"
                      onClick={() => deleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
