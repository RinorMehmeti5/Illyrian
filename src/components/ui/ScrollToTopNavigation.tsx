// src/components/ui/ScrollToTopNavigation.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTopNavigation - Component that scrolls to the top of the page when route changes
 * This component doesn't render anything visible - it just contains the logic for scrolling
 */
const ScrollToTopNavigation = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Using 'instant' instead of 'smooth' for route changes
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTopNavigation;
