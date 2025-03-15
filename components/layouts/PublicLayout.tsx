// components/layouts/PublicLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../src/views/shared/Header";
import Footer from "../../src/views/shared/Footer";

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
