import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from "../../context/AppContext.jsx";


function Navbar() {
  const {navigate ,token } = useAppContext()


  return (
    <nav className="w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <img
          onClick={() => navigate('/')}
          src={assets?.logo ?? '/assets/placeholder-logo.png'}
          alt="logo"
          className="w-36 sm:w-44 cursor-pointer"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 text-base bg-primary text-white rounded-full px-10 py-3 shadow-md hover:scale-105 transition"
          >
           {token ? 'Dashboard' : 'Login'}
            <img src={assets?.arrow ?? '/assets/arrow-right.png'} className="w-4" alt="arrow" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
