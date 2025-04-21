// components/ui/HeroCarousel.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
  autoplaySpeed = 7000, // Default 5 seconds between slides
}) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
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

  // Animation variants
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

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
    setDirection(newDirection);

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

    // Determine direction based on current position
    const newDirection = index > currentSlide ? 1 : -1;
    setDirection(newDirection);
    setCurrentSlide(index);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {" "}
      {/* Added bg-black to prevent white flash */}
      {/* Background Image Carousel */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        {" "}
        {/* Changed to sync mode */}
        <motion.div
          key={`slide-bg-${currentSlide}`}
          className="absolute inset-0 z-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div
            style={{
              backgroundImage: `url('${slides[currentSlide].backgroundImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
            }}
            className="transition-transform duration-500 ease-in-out"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Content Layer (separate from background) */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-8 relative z-10">
          {" "}
          {/* Higher z-index */}
          <AnimatePresence custom={direction} mode="sync">
            {" "}
            {/* Changed to sync mode */}
            <motion.div
              key={`content-${currentSlide}`}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={heroTextVariants}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                {t(slides[currentSlide].title)}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                {t(slides[currentSlide].description)}
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
          </AnimatePresence>
        </div>
      </div>
      {/* Navigation Arrows */}
      <motion.button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center focus:outline-none z-20"
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
        className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center focus:outline-none z-20"
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
      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroCarousel;
