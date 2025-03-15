// src/views/Home.tsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8],
    ["#FFFDF2", "#FFFDF2", "#FFFDF2", "#FFFDF2", "#FFFDF2"]
  );

  // Sample data for different sections
  const featuredCards = [
    {
      title: "Professional Training",
      description:
        "Get personalized training from our certified professional trainers.",
      icon: "💪",
    },
    {
      title: "Modern Equipment",
      description:
        "Access to state-of-the-art fitness equipment and facilities.",
      icon: "🏋️",
    },
    {
      title: "Nutrition Planning",
      description: "Custom nutrition plans to complement your fitness goals.",
      icon: "🥗",
    },
  ];

  const membershipPlans = [
    {
      name: "Basic",
      price: "$29",
      period: "monthly",
      features: [
        "Access to gym floor",
        "Basic equipment usage",
        "2 group classes/month",
      ],
    },
    {
      name: "Premium",
      price: "$49",
      period: "monthly",
      features: [
        "Full gym access",
        "All equipment usage",
        "Unlimited group classes",
        "1 personal training session/month",
      ],
    },
    {
      name: "Elite",
      price: "$99",
      period: "monthly",
      features: [
        "24/7 gym access",
        "Premium equipment",
        "Unlimited classes",
        "4 personal training sessions/month",
        "Nutrition consultation",
      ],
    },
  ];

  const faqItems = [
    {
      question: "What are your opening hours?",
      answer:
        "Our gym is open Monday to Friday from 6:00 AM to 10:00 PM, and weekends from 8:00 AM to 8:00 PM. Elite members enjoy 24/7 access with their membership card.",
    },
    {
      question: "Do you offer trial memberships?",
      answer:
        "Yes, we offer a 3-day free trial for new members. This includes access to all facilities and group classes. Contact our front desk to schedule your trial days.",
    },
    {
      question: "What qualifications do your trainers have?",
      answer:
        "All our trainers are certified professionals with a minimum of 3 years experience. Many hold multiple certifications in specialized areas such as strength training, nutrition, and rehabilitation.",
    },
    {
      question: "Can I freeze my membership?",
      answer:
        "Yes, members can freeze their membership for up to 3 months per year. A small administrative fee applies. Please provide at least 7 days notice before the billing cycle.",
    },
    {
      question: "Do you have parking facilities?",
      answer:
        "We provide free parking for all members in our underground parking lot. Simply scan your membership card at the entrance.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Member since 2021",
      content:
        "This gym has completely transformed my fitness journey. The trainers are knowledgeable and supportive, and the community is amazing!",
      image: "/photos/placeholder1.jpg",
    },
    {
      name: "Mark Thompson",
      role: "Elite Member",
      content:
        "The 24/7 access fits perfectly with my busy schedule. The equipment is always well-maintained and the staff is incredibly helpful.",
      image: "/photos/placeholder2.jpg",
    },
    {
      name: "Emily Chen",
      role: "Premium Member",
      content:
        "I've tried many gyms before, but the personalized approach here has helped me achieve results I never thought possible.",
      image: "/photos/placeholder3.jpg",
    },
    {
      name: "David Rodriguez",
      role: "Member since 2020",
      content:
        "The nutrition planning combined with personal training has been a game-changer for me. I've lost 30 pounds and feel stronger than ever!",
      image: "/photos/placeholder4.jpg",
    },
  ];

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
      },
    }),
  };

  const accordionVariants = {
    closed: { height: "60px", overflow: "hidden" },
    open: {
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  // Carousel direction control
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < testimonials.length) {
      setPage([newPage, newDirection]);
      setCurrentSlide(newPage);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="pt-16" // Add padding for fixed header
    >
      {/* Hero Section with Background */}
      <motion.section
        className="min-h-screen flex items-center relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <motion.div
            style={{
              backgroundImage: "url('/photos/background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
            }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </motion.div>
        </div>

        <div className="w-full px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              variants={heroTextVariants}
            >
              {t("Transform Your Fitness Journey")}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white mb-8"
              variants={heroTextVariants}
            >
              {t(
                "Achieve your goals with our comprehensive management solution and professional guidance."
              )}
            </motion.p>
            <motion.div variants={heroTextVariants}>
              <motion.button
                className="px-8 py-3 bg-[#FFFDF2] text-black font-semibold rounded-md text-lg shadow-lg mr-4"
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
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
      </motion.section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-[#FFFDF2]">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              {t("Why Choose Us")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "We offer comprehensive solutions to help you achieve your fitness goals"
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-[#FFFDF2] p-8 rounded-lg shadow-md flex flex-col items-center text-center border border-black"
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                whileHover="hover"
                viewport={{ once: true, amount: 0.3 }}
              >
                <span className="text-5xl mb-4">{card.icon}</span>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Table Section */}
      <section className="py-20 bg-black">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("Membership Plans")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("Choose the perfect plan that fits your fitness journey")}
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  <th className="px-4 py-5 text-left text-lg font-bold text-white">
                    Plan
                  </th>
                  <th className="px-4 py-5 text-left text-lg font-bold text-white">
                    Price
                  </th>
                  <th className="px-4 py-5 text-left text-lg font-bold text-white">
                    Features
                  </th>
                  <th className="px-4 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {membershipPlans.map((plan, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-700"
                    variants={tableRowVariants}
                    initial="hidden"
                    whileInView="visible"
                    custom={index}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <td className="px-4 py-5 text-white font-semibold">
                      {plan.name}
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-white font-bold text-2xl">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-1">/{plan.period}</span>
                    </td>
                    <td className="px-4 py-5">
                      <ul className="list-disc pl-5 text-gray-300">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex}>{feature}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <motion.button
                        className="px-6 py-2 bg-[#FFFDF2] text-black rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t("Select")}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordions Section */}
      <section className="py-20 bg-[#FFFDF2]">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              {t("Frequently Asked Questions")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("Find answers to common questions about our gym and services")}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className="mb-4 overflow-hidden bg-[#FFFDF2] rounded-lg shadow-md border border-black"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                variants={accordionVariants}
                animate={activeAccordion === index ? "open" : "closed"}
              >
                <div
                  className="px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <h3 className="text-lg font-semibold text-black">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </motion.div>
                </div>
                <div
                  className={`px-6 pb-4 ${
                    activeAccordion !== index && "hidden"
                  }`}
                >
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <section className="py-20 bg-black">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("What Our Members Say")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("Hear from our community of fitness enthusiasts")}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden relative h-96">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute w-full h-full"
                >
                  <div className="bg-[#FFFDF2] shadow-lg rounded-lg p-8 h-full flex flex-col md:flex-row items-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                      <img
                        src={
                          testimonials[page].image ||
                          `https://via.placeholder.com/200x200?text=${testimonials[page].name}`
                        }
                        alt={testimonials[page].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-lg italic text-gray-600 mb-4">
                        "{testimonials[page].content}"
                      </blockquote>
                      <p className="font-bold text-black">
                        {testimonials[page].name}
                      </p>
                      <p className="text-gray-500">{testimonials[page].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <motion.button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center focus:outline-none"
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentSlide === 0}
              style={{ opacity: currentSlide === 0 ? 0.5 : 1 }}
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
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center focus:outline-none"
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentSlide === testimonials.length - 1}
              style={{
                opacity: currentSlide === testimonials.length - 1 ? 0.5 : 1,
              }}
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
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`mx-1 w-3 h-3 rounded-full ${
                    currentSlide === index ? "bg-[#FFFDF2]" : "bg-gray-600"
                  }`}
                  onClick={() => {
                    const direction = index > currentSlide ? 1 : -1;
                    setPage([index, direction]);
                    setCurrentSlide(index);
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-[#FFFDF2]">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-black">
              {t("Ready to Start Your Fitness Journey?")}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              {t(
                "Join our community today and transform your life with our expert guidance and support."
              )}
            </p>
            <motion.button
              className="px-8 py-3 bg-black text-white font-semibold rounded-md text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Get Started Now")}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
