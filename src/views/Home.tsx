//src/views/Home.tsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Marquee } from "../components/magicui/marquee";
import { Pointer } from "../components/magicui/pointer";
import { LuDumbbell } from "react-icons/lu";
import HeroCarousel from "../components/ui/HeroCarousel"; // Import the new component
import ScrollToTop from "../components/ui/ScrollToTop";

import { BorderBeam } from "../components/magicui/border-beam";

// ReviewCard component for the Marquee
const ReviewCard: React.FC<{
  img: string;
  name: string;
  username: string;
  body: string;
}> = ({ img, name, username, body }) => {
  return (
    <figure className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-[#FFFDF2] hover:bg-[#FFFDF2]/90 dark:border-white/10">
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-black/60">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

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

  // Sample data for hero carousel
  const heroSlides = [
    {
      id: 1,
      backgroundImage: "/photos/background.jpg", // Using placeholder until you have real images
      title: "Transform Your Fitness Journey",
      description:
        "Achieve your goals with our comprehensive management solution and professional guidance.",
    },
    {
      id: 2,
      backgroundImage: "/photos/background2.jpg",
      title: "State-of-the-Art Facilities",
      description:
        "Experience training with premium equipment in a modern, motivating environment.",
    },
    {
      id: 3,
      backgroundImage: "/photos/background3.jpg",
      title: "Expert Personal Trainers",
      description:
        "Our certified trainers create customized plans to help you reach your fitness goals faster.",
    },
  ];

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

  // Quick reviews for the Marquee component
  const quickReviews = [
    {
      name: "Alex",
      username: "@alexfitness",
      body: "Lost 15lbs in just 2 months! Best trainers ever.",
      img: "/api/placeholder/40/40",
    },
    {
      name: "Maria",
      username: "@maria_strong",
      body: "The nutrition plan changed my relationship with food. Amazing results!",
      img: "/api/placeholder/40/40",
    },
    {
      name: "Jason",
      username: "@jasonlift",
      body: "From barely being able to run to completing a half-marathon. Thank you!",
      img: "/api/placeholder/40/40",
    },
    {
      name: "Kim",
      username: "@kim_fitness",
      body: "The community here keeps me accountable. Love the support!",
      img: "/api/placeholder/40/40",
    },
    {
      name: "Carlos",
      username: "@carlos_fit",
      body: "Premium membership is worth every penny. Can't imagine training elsewhere now.",
      img: "/api/placeholder/40/40",
    },
    {
      name: "Tina",
      username: "@tinahealth",
      body: "Group classes are so much fun! I look forward to them every week.",
      img: "/api/placeholder/40/40",
    },
  ];

  const firstRow = quickReviews.slice(0, quickReviews.length / 2);
  const secondRow = quickReviews.slice(quickReviews.length / 2);

  // Animation variants
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
    <motion.div ref={containerRef} style={{ backgroundColor }} className="">
      {/* Replace static hero section with the new carousel component */}
      <HeroCarousel slides={heroSlides} autoplaySpeed={6000} />

      {/* Feature Cards Section */}
      <section className="py-20 bg-[#FFFDF2]">
        <div className="w-full px-8 relative">
          <Pointer>
            {/* Dumbbell SVG */}
            <LuDumbbell className="text-3xl text-gray-800 dark:text-gray-900" />
          </Pointer>
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

      {/* Membership Plans Cards Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-lg overflow-hidden ${
                  index === 1 ? "relative transform md:scale-105 md:-my-2" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                viewport={{ once: true }}
              >
                {/* Add BorderBeam to the middle (Premium) card */}
                {index === 1 && (
                  <BorderBeam
                    size={80}
                    duration={8}
                    colorFrom="#ffaa40"
                    colorTo="#9c40ff"
                    initialOffset={0}
                  />
                )}

                <div
                  className={`h-full flex flex-col ${
                    index === 1
                      ? "bg-[#FFFDF2] text-black border-2 border-[#FFFDF2]"
                      : "bg-gray-900 text-white border border-gray-700"
                  }`}
                >
                  {/* Plan header */}
                  <div
                    className={`p-8 ${
                      index === 1 ? "bg-[#FFFDF2]" : "bg-gray-800"
                    }`}
                  >
                    <h3
                      className={`text-2xl font-bold mb-2 ${
                        index === 1 ? "text-black" : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span
                        className={`ml-2 ${
                          index === 1 ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Plan features */}
                  <div className="flex-grow p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <svg
                            className={`w-5 h-5 mr-2 mt-0.5 ${
                              index === 1 ? "text-black" : "text-[#FFFDF2]"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span
                            className={
                              index === 1 ? "text-gray-800" : "text-gray-300"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA button */}
                  <div className="p-8 pt-0">
                    <motion.button
                      className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                        index === 1
                          ? "bg-black text-[#FFFDF2] hover:bg-gray-800"
                          : "bg-[#FFFDF2] text-black hover:bg-[#FFFDF2]/90"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index === 1 ? t("Get Started") : t("Select Plan")}
                    </motion.button>
                  </div>

                  {/* Popular badge for the Premium plan */}
                  {index === 1 && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-black text-[#FFFDF2] py-1 px-4 rounded-bl-lg font-medium">
                        {t("Most Popular")}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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
            {/* Carousel container */}
            <div className="overflow-hidden relative h-96">
              {/* Use simple opacity transitions instead of AnimatePresence */}
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="absolute w-full h-full transition-all duration-500 ease-in-out"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform: `translateX(${
                      currentSlide === index
                        ? 0
                        : index > currentSlide
                        ? 100
                        : -100
                    }%)`,
                    visibility:
                      Math.abs(currentSlide - index) <= 1
                        ? "visible"
                        : "hidden", // Only render adjacent slides
                  }}
                >
                  <div className="bg-[#FFFDF2] shadow-lg rounded-lg p-8 h-full flex flex-col md:flex-row items-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                      <img
                        src={
                          testimonial.image ||
                          `/api/placeholder/200/200?text=${testimonial.name}`
                        }
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-lg italic text-gray-600 mb-4">
                        "{testimonial.content}"
                      </blockquote>
                      <p className="font-bold text-black">{testimonial.name}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed position Navigation Arrows with improved structure */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 pointer-events-none z-10">
              <motion.button
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center focus:outline-none pointer-events-auto"
                onClick={() => {
                  if (currentSlide > 0) {
                    setCurrentSlide(currentSlide - 1);
                    setPage([currentSlide - 1, -1]);
                  }
                }}
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
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center focus:outline-none pointer-events-auto"
                onClick={() => {
                  if (currentSlide < testimonials.length - 1) {
                    setCurrentSlide(currentSlide + 1);
                    setPage([currentSlide + 1, 1]);
                  }
                }}
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
            </div>

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

      {/* New Social Proof Marquee Section */}
      <section className="py-16 bg-[#FFFDF2]">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              {t("Member Success Stories")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("Real results from our dedicated community")}
            </p>
          </motion.div>

          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee className="[--duration:20s]" pauseOnHover>
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:20s]" pauseOnHover>
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#FFFDF2]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#FFFDF2]"></div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-black">
        <div className="w-full px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {t("Ready to Start Your Fitness Journey?")}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              {t(
                "Join our community today and transform your life with our expert guidance and support."
              )}
            </p>
            <motion.button
              className="px-8 py-3 bg-[#FFFDF2] text-black font-semibold rounded-md text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Get Started Now")}
            </motion.button>
          </motion.div>
        </div>
      </section>
      <ScrollToTop color="#000000" backgroundColor="#FFFDF2" />
    </motion.div>
  );
};

export default Home;
