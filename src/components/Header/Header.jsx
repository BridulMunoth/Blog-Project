import React from "react";
import { Container, Logo, LogoutBtn, ThemeToggle } from "../index";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  console.log("Auth Status:", authStatus);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="relative py-4 shadow-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 shadow-lg shadow-orange-500/30" />
      <Container>
        <nav className="relative flex items-center z-10">
          <div className="mr-6 transform hover:scale-105 transition-transform duration-300">
            <Link to="/">
              <Logo width="160px" />
            </Link>
          </div>
          <ul className="flex items-center ml-auto gap-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${location.pathname === item.slug
                      ? "bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-orange-500/50"
                      : "hover:bg-white/10 text-white/90 hover:text-white"}
                    `}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            <li className="ml-3">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
