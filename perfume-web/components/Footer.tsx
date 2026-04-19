"use client";

import StarRating from "./StarRating";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-200 mt-16 sm:mt-20">
      <div className="content-px section-padding">
        <div className="content-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 sm:gap-12 mb-12">
            {/* Customer Service */}
            <div>
              <h4 className="text-white font-semibold mb-8 tracking-wide text-base uppercase letter-spacing-1">
                Customer Service
              </h4>
              <ul className="space-y-5 text-gray-600">
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Contact Us  (+92 321-1315355)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Shipping Info  (+92 321-1315355)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Featured */}
            <div>
              <h4 className="text-white font-semibold mb-8 tracking-wide text-base uppercase letter-spacing-1">
                Featured
              </h4>
              <ul className="space-y-5 text-gray-600">
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Luxury Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base hover:text-white transition-colors">
                    Gift Sets
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-white font-semibold mb-10 tracking-wide text-base uppercase letter-spacing-1">
                Follow Us
              </h4>
              <div className="flex gap-10">
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#C9A24A] transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                    <circle cx="12" cy="12" r="3.6" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#C9A24A] transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#C9A24A] transition-colors"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 1 2-1c0-3-3-5.5-6-5.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#C9A24A] transition-colors"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.498 3h-3.5a1 1 0 00-1 1v12a4 4 0 01-4 4H9.5a1 1 0 000 2h1.498a6 6 0 006-6V4a1 1 0 00-1-1zM6.5 9a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0-2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#C9A24A] transition-colors"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 2.5-1.34 2.5-1.5 0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5 0 .16.17 1.5 2.5 1.5z" />
                  </svg>
                </a>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-600">
                  General Feedback
                </p>
                <StarRating value={0} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-10 content-px">
        <div className="content-container">
          <p className="text-gray-600 text-sm text-center leading-relaxed">
            &copy; {new Date().getFullYear()} The Olfactory Gallery. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
