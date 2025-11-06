import React, { useEffect, useState } from "react";

function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const initial = stored || "light";
      setTheme(initial);
      if (initial === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      if (!stored) {
        localStorage.setItem("theme", initial);
      }
    } catch {}
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21.64 13A9 9 0 1 1 11 2.36 7 7 0 0 0 21.64 13Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM12 4a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm8 9a1 1 0 0 1-1-1 1 1 0 1 1 2 0 1 1 0 0 1-1 1ZM5 12a1 1 0 0 1-1-1 1 1 0 1 1 2 0 1 1 0 0 1-1 1Zm12.95 6.36a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 1 1 1.41-1.42l.71.71a1 1 0 0 1 0 1.41ZM7.17 7.76a1 1 0 0 1-1.41 0l-.71-.71A1 1 0 0 1 6.46 5.6l.71.71a1 1 0 0 1 0 1.41Zm10.59-1.41a1 1 0 0 1 0-1.41l.71-.71A1 1 0 1 1 20.89 5l-.71.71a1 1 0 0 1-1.41 0ZM4.53 20.89a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.7a1 1 0 0 1 0 1.42Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
