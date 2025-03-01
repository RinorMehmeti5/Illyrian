// App.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./AppRoutes/AppRoutes";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </div>
  );
}

export default App;
