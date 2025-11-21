import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="cursor-pointer w-full rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition"
    >
      {/* Image */}
      <div className="h-48 md:h-56 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="inline-block px-3 py-1 text-xs bg-primary/20 text-primary rounded-full">
          {category}
        </span>

        <h3 className="mt-3 text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{"__html":description.slice(0, 120)}}>
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
