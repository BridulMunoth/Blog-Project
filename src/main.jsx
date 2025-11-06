import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./components/index.js";

import { Home, Login, Signup, AllPosts, AddPost, EditPost , Post} from "./pages/index.js";
import brmIcon from "./assets/BRM Blogger.png";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}   
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
]);

// Set app title and favicon at runtime (works in dev and production)
document.title = "BRM Blogger";
const existingFavicon = document.querySelector('link[rel="icon"]');
const faviconLink = existingFavicon || document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.href = brmIcon;
if (!existingFavicon) {
  document.head.appendChild(faviconLink);
}

// Normalize theme to light on first load unless the app explicitly toggles it later
try {
  if (localStorage.getItem('theme') !== 'light') {
    localStorage.setItem('theme', 'light');
  }
  document.documentElement.classList.remove('dark');
} catch (_) {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
);
