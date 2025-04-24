// components/layouts/PublicLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../views/shared/Header";
import Footer from "../../views/shared/Footer";
import ScrollToTopNavigation from "../ui/ScrollToTopNavigation";
import ScrollToTop from "../ui/ScrollToTop"; // Your scroll-to-top button from previous request

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add ScrollToTopNavigation component for automatic scroll to top on route change */}
      <ScrollToTopNavigation />

      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />

      {/* Scroll to top button */}
      <ScrollToTop color="#000000" backgroundColor="#FFFDF2" />
    </div>
  );
};

export default PublicLayout;
