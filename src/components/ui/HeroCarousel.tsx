// components/ui/HeroCarousel.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, Variants } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

// Define the structure for a single slide
interface SlideData {
  id: number;
  backgroundImage: string;
  title: string;
  description: string;
}

interface HeroCarouselProps {
  slides: SlideData[];
  autoplaySpeed?: number; // milliseconds between auto transitions
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoplaySpeed = 7000, // Default 7 seconds between slides
}) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Preload images to prevent white flash
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.backgroundImage;
    });
  }, [slides]);

  // Enable autoplay
  useEffect(() => {
    if (autoplaySpeed <= 0 || isAnimating) return; // Disable during animations or if speed is 0

    const intervalId = setInterval(() => {
      paginate(1); // Move to next slide
    }, autoplaySpeed);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentSlide, autoplaySpeed, isAnimating]);

  // Animation variants for text elements (we're keeping these)
  const heroTextVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  // Handle navigation
  const paginate = (newDirection: number) => {
    if (isAnimating) return; // Prevent rapid clicking

    setIsAnimating(true);

    if (newDirection > 0) {
      // Move to next slide (or loop back to first)
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    } else {
      // Move to previous slide (or loop to last)
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }

    // Reset animating flag after transition time
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Manual navigation to a specific slide
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setCurrentSlide(index);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image without Framer Motion */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={`slide-bg-${index}`}
            style={{
              backgroundImage: `url('${slide.backgroundImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Content Layer (separate from background) */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-8 relative z-10">
          {slides.map((slide, index) => (
            <motion.div
              key={`content-${index}`}
              initial="hidden"
              animate={currentSlide === index ? "visible" : "exit"}
              variants={heroTextVariants}
              className="max-w-3xl"
              style={{ display: currentSlide === index ? "block" : "none" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                {t(slide.title)}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                {t(slide.description)}
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-8 py-3 bg-[#FFFDF2] text-black font-semibold rounded-md text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("Join Now")}
                </motion.button>
                <motion.button
                  className="px-8 py-3 border-2 border-[#FFFDF2] text-[#FFFDF2] font-semibold rounded-md text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("Learn More")}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed position Navigation Arrows with improved styles */}
      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-20 flex justify-between px-4 pointer-events-none">
        <motion.button
          className="w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center focus:outline-none pointer-events-auto"
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isAnimating}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </motion.button>
        <motion.button
          className="w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center focus:outline-none pointer-events-auto"
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isAnimating}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 inset-x-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-[#FFFDF2]" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            disabled={isAnimating}
            initial={{ opacity: 0.7 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0.7,
              scale: currentSlide === index ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      {/* Scroll indicator - perfectly centered */}
      <div className="absolute bottom-20 inset-x-0 flex justify-center items-center z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <FaArrowDown size={40} className="text-white" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCarousel;
