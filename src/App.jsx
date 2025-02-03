// App.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Form from "./views/auth/form";
import Packages from "./views/phamacore/packages";
import Summary from "./views/auth/summary";
import Terms from "./views/auth/terms";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Packages />,
  },
  {
    path: "form",
    element: <Form />,
  },
  {
    path: "summary",
    element: <Summary />,
  },
  {
    path: "terms",
    element: <Terms />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
