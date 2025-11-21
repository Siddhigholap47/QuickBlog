import React from 'react';
import { blog_data, blogCategories as categoriesFromAssets } from '../assets/assets';
import { useAppContext } from '../../context/AppContext';
import BlogCard from './BlogCard';
import { motion } from 'framer-motion';

const BlogList = () => {
  const [menu, setMenu] = React.useState('All');

  // call context hook (if it exists). If it throws or returns nothing, fallback to {}
  let appCtx = {};
  try {
    // If your AppContext hook is present this will run. If not, it will throw and get caught.
    appCtx = useAppContext() || {};
  } catch (e) {
    appCtx = {};
  }

  const blogs =
    Array.isArray(appCtx.blogs) && appCtx.blogs.length ? appCtx.blogs : Array.isArray(blog_data) ? blog_data : [];

  const input = typeof appCtx.input === 'string' ? appCtx.input : '';

  // ensure categories include 'All' as the first option
  const blogCategories = Array.isArray(categoriesFromAssets)
    ? ['All', ...categoriesFromAssets.filter((c) => c !== 'All')]
    : ['All'];

  const filteredBlogs = React.useMemo(() => {
    if (!input || input.trim() === '') return blogs;
    const q = input.toLowerCase();
    return blogs.filter(
      (blog) =>
        (blog.title && blog.title.toLowerCase().includes(q)) ||
        (blog.category && blog.category.toLowerCase().includes(q))
    );
  }, [blogs, input]);

  // final list after applying category filter (case-insensitive)
  const visibleBlogs = React.useMemo(() => {
    if (!Array.isArray(filteredBlogs)) return [];
    if (!menu || menu === 'All') return filteredBlogs;
    const m = menu.toLowerCase();
    return filteredBlogs.filter((b) => (b.category || '').toLowerCase() === m);
  }, [filteredBlogs, menu]);

  return (
    <section>
      {/* Category pills */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10">
        {blogCategories.map((item) => (
          <div key={item}>
            <button
              onClick={() => setMenu(item)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                menu === item ? 'bg-primary text-white' : 'text-gray-600 bg-white border'
              }`}
            >
              {item}
            </button>
          </div>
        ))}
      </div>

      {/* Blog grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24"
        >
          {visibleBlogs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No posts found.</div>
          ) : (
            visibleBlogs.map((blog) => <BlogCard key={blog._id ?? blog.id ?? blog.slug ?? blog.title} blog={blog} />)
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogList;
