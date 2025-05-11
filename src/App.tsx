import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";

// Create a router with our routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
