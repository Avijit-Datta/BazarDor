import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { formatBnDate } from "../lib/bn";
import PriceMarquee from "./PriceMarquee";

export default function Navbar() {
  const { categories } = useData();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const today = formatBnDate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-xl shadow-sm sm:h-11 sm:w-11">
            🛒
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-base-content sm:text-lg">বাজার দর</span>
            <span className="block text-[11px] text-base-content/55 sm:text-xs">{today}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link to="/signin" className="btn btn-ghost btn-sm sm:btn-md">
                সাইন ইন
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
                সাইন আপ
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-base-content/10 bg-base-200 py-1 pl-1 pr-2.5 transition hover:border-primary/40 sm:py-1.5 sm:pl-1.5 sm:pr-3"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
                />
                <span className="hidden text-sm font-medium sm:inline">{user.name.split(" ")[0]}</span>
                <svg
                  className={`h-3.5 w-3.5 text-base-content/60 transition-transform ${open ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-base-content/10 bg-base-100 p-4 shadow-2xl animate-fade-in-up">
                  <div className="flex items-center gap-3 border-b border-base-content/10 pb-3">
                    <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-base-content/55">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-base-content/80 hover:bg-base-200"
                    >
                      👤 আমার প্রোফাইল
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-error hover:bg-error/10"
                    >
                      ↩ সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="scrollbar-none mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
        {categories.map((c) => (
          <NavLink
            key={c.slug}
            to={`/category/${c.slug}`}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <span>{c.icon}</span>
            <span>{c.nameBn}</span>
          </NavLink>
        ))}
      </nav>

      <PriceMarquee />
    </header>
  );
}
