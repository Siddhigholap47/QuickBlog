import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import AdminLayout from './pages/admin/layout.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import AddBlog from './pages/admin/addBlog.jsx';
import ListBlog from './pages/admin/listBlog.jsx';
import Comments from './pages/admin/comments.jsx';
import Login from './components/admin/login.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import 'quill/dist/quill.snow.css';
import Navbar from './components/Navbar.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const { token } = useAppContext();
  const location = useLocation();

  // Only show navbar on non-admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        {/* Only one route for login! */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin routes protected by token, only one layout! */}
        <Route path="/admin/*" element={
          token ? <AdminLayout /> : <Navigate to="/admin/login" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="addblog" element={<AddBlog />} />
          <Route path="listblog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
