import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  CART_URL,
  PRODUCTLIST_URL,
  ROOT_URL_PREFIX,
} from "../utils";

type HeaderProps = {
  cartItemCount?: number;
  onCartClick?: () => void;
};

const navLinks = [
  { to: ROOT_URL_PREFIX, label: "Home" },
  { to: PRODUCTLIST_URL, label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: CART_URL, label: "Cart" },
];

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [passedHowItWorks, setPassedHowItWorks] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if at bottom
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300;
      setAtBottom(isBottom);
      setScrolled(window.scrollY > 80);

      // Check if passed How It Works section (approximately 40% down the page)
      const pageHeight = document.documentElement.scrollHeight;
      const howItWorksPosition = pageHeight * 0.35; // Roughly where HowItWorks appears
      setPassedHowItWorks(window.scrollY > howItWorksPosition && !isBottom);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        atBottom
          ? "bg-gradient-to-r from-[#1a7a8c] to-[#2d9caf] shadow-lg py-2"
          : passedHowItWorks
            ? "bg-gradient-to-r from-[#0f3a4a] to-[#1a5a6e] shadow-lg py-2"
            : "bg-white py-4 border-b border-slate-200/50 shadow-sm"
      }`}
    >
      <div className="w-full px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <NavLink
              className="flex items-center cursor-pointer flex-shrink-0"
              to={ROOT_URL_PREFIX}
            >
              <span
                className={`text-xl font-medium tracking-tight transition-colors duration-300 ${
                  atBottom || passedHowItWorks ? "text-white" : "text-slate-900"
                }`}
              >
                <span
                  className={`text-xs transition-colors duration-300 ${
                    atBottom || passedHowItWorks
                      ? "text-white/80"
                      : "text-slate-500"
                  }`}
                >
                  PharmX{" "}
                </span>
                {/* <span className="text-base font-semibold">NOUN</span> */}
              </span>
            </NavLink>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:block flex-1">
              <ul className="flex justify-center space-x-6">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      className={({ isActive }) =>
                        `text-sm transition-colors font-medium ${
                          atBottom || passedHowItWorks
                            ? isActive
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                            : isActive
                              ? "text-slate-900"
                              : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                      to={link.to}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                className={`flex items-center gap-2 text-sm transition-colors hidden md:flex ${
                  atBottom || passedHowItWorks
                    ? "text-white/70 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Account
              </button>

              {onCartClick ? (
                <button
                  onClick={onCartClick}
                  className={`relative transition-colors ${
                    atBottom || passedHowItWorks
                      ? "text-white/70 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              ) : (
                <NavLink
                  to={CART_URL}
                  className={`relative transition-colors ${
                    atBottom || passedHowItWorks
                      ? "text-white/70 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>
              )}

              <button
                className={`lg:hidden transition-colors ${
                  atBottom || passedHowItWorks
                    ? "text-white/70 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar - Centered below */}
          <div className="mt-4 hidden md:block max-w-screen-2xl mx-auto">
            <div className="relative max-w-2xl mx-auto">
              <svg
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                  scrolled ? "text-slate-400" : "text-white/50"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search medicines, health products..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <nav className="mt-4 lg:hidden border-t border-slate-200 pt-4 max-w-screen-2xl mx-auto">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block w-full text-left py-2 text-sm transition-colors ${
                          atBottom || passedHowItWorks
                            ? isActive
                              ? "text-white font-medium"
                              : "text-white/70 hover:text-white"
                            : isActive
                              ? "text-slate-900 font-medium"
                              : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                      to={link.to}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
