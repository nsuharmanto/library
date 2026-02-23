import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-neutral-300 py-8 px-4 md:px-[120px]">
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Logo & Brand */}
      <div className="flex flex-row h-11 tems-center gap-2">
        <img
          src="/logos/booky_logo.svg"
          alt="Booky Logo"
          className="w-10"
          style={{ minWidth: 42, minHeight: 42 }}
        />
        <span className="font-extrabold text-gray-950 text-display-md md:text-3xl">Booky</span>
      </div>
      {/* Description */}
      <p className="text-center text-gray-950 font-semibold text-sm md:text-base max-w-xl">
        Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online
        or visit our nearest library branch.
      </p>
      {/* Social Media */}
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="font-semibold text-base md:text-lg mt-2 mb-1">Follow on Social Media</span>
        <div className="flex gap-4 mt-1">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="rounded-full border border-gray-300 p-4 hover:bg-gray-200 transition"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="rounded-full border border-gray-300 p-4 hover:bg-gray-200 transition"
          >
            <img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-gray-300 p-4 hover:bg-gray-200 transition"
          >
            <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="rounded-full border border-gray-300 p-4 hover:bg-gray-200 transition"
          >
            <img src="/icons/tiktok.svg" alt="TikTok" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;