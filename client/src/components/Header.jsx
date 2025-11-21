import React, { useRef } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../../context/AppContext.jsx';

function Header() {
  const { setInput, input } = useAppContext() ?? {};
  const inputRef = useRef();

  const onClear = () => {
    if (typeof setInput === 'function') setInput('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const value = inputRef.current?.value ?? '';
    if (typeof setInput === 'function') setInput(value);
  };

  return (
    <header className="relative w-full overflow-hidden">
      {/* soft background blob centered behind content */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center -z-10"
        aria-hidden="true"
      >
        <img
          src={assets.gradientBackground}
          alt=""
          className="w-[900px] sm:w-[1100px] md:w-[1300px] lg:w-[1600px] opacity-60"
        />
      </div>

      {/* page content - centered and wider */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 border border-primary/30 bg-primary/10 rounded-full text-sm text-primary">
          <span>✨ New: AI feature integrated</span>
          <img src={assets.star_icon} alt="" className="w-3" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Your own <span className="text-primary">blogging</span> <br /> Platform.
        </h1>

        {/* Subhead */}
        <p className="max-w-2xl text-sm sm:text-base text-gray-600 mb-6">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your
          story starts right here.
        </p>

        {/* Search form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for blogs"
            className="flex-1 px-4 py-3 rounded-full outline-none text-sm"
            defaultValue={input ?? ''}
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform"
          >
            Search
          </button>
        </form>

        {/* Clear Search (small) */}
        {input && (
          <button
            onClick={onClear}
            className="mt-3 border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
