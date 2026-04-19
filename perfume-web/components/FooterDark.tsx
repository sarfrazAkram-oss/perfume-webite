"use client";

export default function FooterDark() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-[#1F1F1F]">
      <div className="mx-auto max-w-6xl px-8 sm:px-16 lg:px-32 py-60 sm:py-80">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 lg:gap-32">
          
          {/* About */}
          <div className="space-y-10 leading-10">
            <h4 className="text-white font-semibold tracking-wider text-xl uppercase">
              The Olfactory Gallery
            </h4>
            <p className="text-gray-400 text-lg leading-10">
              Curating the world’s most exquisite scents within a digital atelier 
              designed for the modern connoisseur.
            </p>
          </div>

          {/* Client Services */}
          <div className="space-y-10 leading-10">
            <h4 className="text-white font-semibold tracking-wider text-xl uppercase">
              Client Services
            </h4>
            <ul className="space-y-6 text-lg">
              <li>
                <a href="#" className="block text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="block text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-10 leading-10">
            <h4 className="text-white font-semibold tracking-wider text-xl uppercase">
              Newsletter
            </h4>
            <p className="text-gray-400 text-lg">
              Enter your email
            </p>

            <div className="flex overflow-hidden rounded border border-[#1F1F1F]">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#111111] px-6 py-5 text-lg text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-[#D4AF37] px-8 py-5 text-lg font-semibold text-black hover:bg-[#E6C767] transition">
                →
              </button>
            </div>
          </div>

        </div>

      </div>
        {/* Copyright */}
        <div className="border-t border-[#1F1F1F] pt-12">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider">
            © 2024 The Olfactory Gallery. All rights reserved.
          </p>
        </div>
    </footer>
  );
}