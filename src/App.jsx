import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(login({ user }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-700 dark:text-slate-200 text-lg font-medium">Loading...</div>
    </div>
  );
}

export default App;
