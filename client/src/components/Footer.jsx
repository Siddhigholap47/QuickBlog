import React from 'react';
import { assets, footer_data } from '../assets/assets';

const Footer = () => {
  return (
    <div className="mt-20 bg-white pt-16 border-t">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">

        {/* Left section */}
        <div className="max-w-[410px]">
          <img src={assets.logo} alt="logo" className="w-32 sm:w-44" />
          <p className="mt-6 text-gray-600">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>

        {/* Links section */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>

              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:underline transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom text */}
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 © QuickBlog GreatStack – All Rights Reserved.
      </p>

    </div>
  );
};

export default Footer;
