import AuthLayout from "@client/pages/auth/AuthLayout";
import Login from "@client/pages/auth/Login";
import Register from "@client/pages/auth/Register";
import Dashboard from "@client/pages/console/Dashboard";
import Permission from "@client/pages/console/system/Permission";
import Role from "@client/pages/console/system/Role";
import User from "@client/pages/console/system/User";
import Home from "@client/pages/Home";
import RootLayout from "@client/pages/RootLayout";
import { createBrowserRouter, redirect } from "react-router";
import ConsoleLayout from "@client/pages/console/ConsoleLayout";
import ErrorPage from "@client/pages/ErrorPage";
import axios from "axios";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home ,
        loader: async () => {
          return redirect("/console/dashboard");
        },
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "console",
        Component: ConsoleLayout,
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "system/permission", Component: Permission},
          { path: "system/role", Component: Role },
          { path: "system/user", Component: User },
        ],
      },
    ],
  },
]);