import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, // FIXED
    name: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// FIXED MODEL NAME
const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
