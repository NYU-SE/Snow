import * as React from "react";
import * as ReactDOM from "react-dom/client";
import axios from 'axios';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root, { loader as rootLoader } from "./root.jsx";
import Signup, { action as signupAction } from "./signup.jsx";
import Login, { action as loginAction } from "./login.jsx";
import Home from "./home.jsx";
import Profile, { loader as profileLoader } from "./profile.jsx";
import Flake, { loader as flakeLoader } from "./flake.jsx";
import Setting from "./setting.jsx";

axios.defaults.baseURL = import.meta.env.VITE_SNOW_API_SERVER;
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "/profile",
        element: <Profile />,
        loader: profileLoader
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
        loader: profileLoader
      },
      {
        path: "/flake/:flakeId",
        element: <Flake />,
        loader: flakeLoader
      },
      {
        path: "/settings",
        element: <Setting />
      }
    ]
  },
  {
    path: '/auth/login',
    element: <Login />,
    action: loginAction
  },
  {
    path: '/auth/signup',
    element: <Signup />,
    action: signupAction
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
