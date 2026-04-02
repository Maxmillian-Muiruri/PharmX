import { NavLink } from "react-router-dom";
import {
  AUTH_URL_PREFIX,
  CART_URL,
  PRODUCTLIST_URL,
  ROOT_URL_PREFIX,
  SIGNUP_URL,
} from "../utils";

const navLinks = [
  { to: ROOT_URL_PREFIX, label: "Home" },
  { to: AUTH_URL_PREFIX, label: "Sign in" },
  { to: SIGNUP_URL, label: "Sign up" },
  { to: PRODUCTLIST_URL, label: "Products" },
  { to: CART_URL, label: "Cart" },
  { to: ROOT_URL_PREFIX, label: "About" },
  { to: ROOT_URL_PREFIX, label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-4">
        <div className="flex items-center justify-between gap-6">
          <NavLink
            className="text-xl font-medium tracking-tight text-slate-900"
            to={ROOT_URL_PREFIX}
          >
            <span className="text-xs text-slate-500">PharmX </span>
            <span className="text-base font-semibold">NOUN</span>
          </NavLink>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-slate-900 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                  }`
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Account
            </button>

            <NavLink
              className="text-slate-600 hover:text-slate-900 transition-colors"
              to={CART_URL}
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
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
      </div>
    </header>
  );
}
