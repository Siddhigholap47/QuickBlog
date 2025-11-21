import React from "react";

const CommentTableItem = ({ comment }) => {
  return (
    <tr>
      <td className="p-2">{comment.blog.title}</td>
      <td className="p-2">{comment.name}</td>
      <td className="p-2">{comment.content}</td>
      <td className="p-2">{comment.isApproved ? "Yes" : "No"}</td>
      <td className="p-2">
        <button className="bg-green-600 text-white px-2 py-1 rounded mr-2">Approve</button>
        <button className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
      </td>
    </tr>
  );
};

export default CommentTableItem;
