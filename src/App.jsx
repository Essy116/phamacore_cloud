// App.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Form from "./views/auth/form";
import Packages from "./views/phamacore/packages";
import Summary from "./views/auth/summary";
import Terms from "./views/auth/terms";
import Login from "./views/phamacore/login";
import Reset from "./views/phamacore/reset";
import ResetLink from "./views/phamacore/resetlink";
import Entry from "./views/phamacore/entry";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Packages />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "resetlink",
    element: <ResetLink />,
  },
  {
    path: "reset",
    element: <Reset />,
  },
  {
    path: "entry",
    element: <Entry />,
  },

  {
    path: "form",
    element: <Form />,
  },
  {
    path: "terms",
    element: <Terms />,
  },
  {
    path: "summary",
    element: <Summary />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
