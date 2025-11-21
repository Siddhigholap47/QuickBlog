import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => (
  <div className="min-w-[200px] bg-gray-100 h-full p-4 flex flex-col gap-4">
    <NavLink to="/admin" className={({ isActive }) => isActive ? "bg-blue-200 p-2 rounded" : "p-2"}>
      <img src={assets.home_icon} alt="Dashboard" className="w-6 inline mr-2" /> Dashboard
    </NavLink>
    <NavLink to="/admin/addblog" className={({ isActive }) => isActive ? "bg-blue-200 p-2 rounded" : "p-2"}>
      <img src={assets.add_icon} alt="Add" className="w-6 inline mr-2" /> Add Blog
    </NavLink>
    <NavLink to="/admin/listblog" className={({ isActive }) => isActive ? "bg-blue-200 p-2 rounded" : "p-2"}>
      <img src={assets.list_icon} alt="List" className="w-6 inline mr-2" /> List Blog
    </NavLink>
    <NavLink to="/admin/comments" className={({ isActive }) => isActive ? "bg-blue-200 p-2 rounded" : "p-2"}>
      <img src={assets.comment_icon} alt="Comments" className="w-6 inline mr-2" /> Comments
    </NavLink>
  </div>
);

export default Sidebar;
