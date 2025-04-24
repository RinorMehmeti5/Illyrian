// src/components/ui/ScrollToTop.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuArrowUp } from "react-icons/lu";

interface ScrollToTopProps {
  showBelow?: number; // Scroll position to show the button (in pixels)
  color?: string; // Primary color for the button
  backgroundColor?: string; // Background color for the button
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  showBelow = 300,
  color = "#000000",
  backgroundColor = "#FFFDF2",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate how far down the page the user has scrolled
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / windowHeight) * 100;

    setScrollProgress(scrollPercentage);
    setIsVisible(scrollTop > showBelow);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the circle's properties for the progress indicator
  const circleRadius = 22;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={scrollToTop}
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg focus:outline-none"
            style={{ backgroundColor }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            {/* SVG for the circular progress indicator */}
            <svg
              className="absolute"
              width="50"
              height="50"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r={circleRadius}
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="2"
              />
              <circle
                cx="25"
                cy="25"
                r={circleRadius}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 25 25)"
              />
            </svg>

            {/* Arrow icon */}
            <LuArrowUp className="relative z-10" size={20} color={color} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
