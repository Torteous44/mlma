import React, { useEffect } from "react";
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
  // Clear browser storage when app mounts
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Browser storage cleared on app mount");
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
