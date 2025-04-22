import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Confetti, type ConfettiRef } from "../components/magicui/confetti";
import { motion, useScroll, useTransform } from "framer-motion";
import { BorderBeam } from "../components/magicui/border-beam";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { AnimatedGridPattern } from "../components/magicui/animated-grid-pattern";
import { cn } from "../lib/utils";
import { FlickeringGrid } from "../components/magicui/flickering-grid";

const Team: React.FC = () => {
  const { t } = useTranslation();
  const confettiRef = useRef<ConfettiRef>(null);
  const containerRef = useRef(null);
  const [activeTrainer, setActiveTrainer] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ["#000", "#FFFDF2", "#FFFDF2", "#000"]
  );

  // Team data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Head Trainer",
      image: "/photos/foto1.png",
      bio: "With over 10 years of experience, Alex specializes in strength training and rehabilitation. His personalized approach has helped hundreds of clients achieve their fitness goals.",
      specialties: ["Strength Training", "Rehabilitation", "Nutrition"],
      certifications: ["NASM-CPT", "CSCS", "FMS Level 2"],
      instagram: "alexfitness",
      twitter: "alexj_fitness",
      linkedin: "alex-johnson-fitness",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Yoga & Pilates Instructor",
      image: "/photos/foto2.jpg",
      bio: "Sarah brings mindfulness to fitness with her extensive background in yoga and pilates. Her classes focus on flexibility, core strength, and mental wellness.",
      specialties: ["Yoga", "Pilates", "Meditation"],
      certifications: ["200hr RYT", "NASM-CPT", "Pilates Method Alliance"],
      instagram: "sarah_moves",
      twitter: "sarahwilliams_yoga",
      linkedin: "sarah-williams-yoga",
    },
    {
      id: 3,
      name: "Marcus Chen",
      role: "CrossFit Coach",
      image: "/photos/foto3.jfif",
      bio: "Marcus is passionate about functional fitness and helping clients push their limits. His high-energy classes combine strength, cardio, and mobility training.",
      specialties: ["CrossFit", "Olympic Lifting", "HIIT"],
      certifications: [
        "CrossFit L3",
        "USAW Sports Performance",
        "Precision Nutrition",
      ],
      instagram: "marcus_crossfit",
      twitter: "marcus_lifts",
      linkedin: "marcus-chen-fitness",
    },
    {
      id: 4,
      name: "Jessica Rodriguez",
      role: "Nutrition Coach",
      image: "/photos/foto4.jpg",
      bio: "Jessica helps clients optimize their nutrition to complement their fitness routine. Her science-based approach creates sustainable eating habits for long-term success.",
      specialties: [
        "Nutrition Planning",
        "Weight Management",
        "Sports Nutrition",
      ],
      certifications: [
        "Precision Nutrition L2",
        "NASM-CNC",
        "Integrative Nutrition Health Coach",
      ],
      instagram: "jessica_nutrition",
      twitter: "jessica_eats",
      linkedin: "jessica-rodriguez-nutrition",
    },
    {
      id: 5,
      name: "David Park",
      role: "Cardio & HIIT Specialist",
      image: "/photos/foto5.jfif",
      bio: "David's dynamic workouts maximize calorie burn while building endurance. His clients love his motivational approach and innovative exercise combinations.",
      specialties: ["HIIT", "Cardio Endurance", "Functional Training"],
      certifications: [
        "ACE-CPT",
        "AFAA Group Fitness",
        "TRX Suspension Training",
      ],
      instagram: "david_hiit",
      twitter: "davidpark_fitness",
      linkedin: "david-park-fitness",
    },
    {
      id: 6,
      name: "Emma Wilson",
      role: "Dance & Rhythmic Fitness",
      image: "/photos/foto5.jpg",
      bio: "Emma brings fun to fitness through dance-based workouts. Her classes combine choreography with effective exercise to create an enjoyable fitness experience.",
      specialties: ["Zumba", "Dance Fitness", "Rhythmic Movement"],
      certifications: [
        "Zumba Instructor",
        "AFAA Group Fitness",
        "Les Mills Certifications",
      ],
      instagram: "emma_dances",
      twitter: "emmawilson_dance",
      linkedin: "emma-wilson-dance",
    },
  ];

  // Weekly schedule data
  const weeklySchedule = [
    {
      day: "Monday",
      classes: [
        {
          time: "06:00 - 07:00",
          name: "Morning CrossFit",
          trainer: "Marcus Chen",
        },
        { time: "09:00 - 10:00", name: "Yoga Flow", trainer: "Sarah Williams" },
        { time: "17:30 - 18:30", name: "HIIT Circuit", trainer: "David Park" },
        {
          time: "19:00 - 20:00",
          name: "Dance Fitness",
          trainer: "Emma Wilson",
        },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        {
          time: "07:00 - 08:00",
          name: "Strength Basics",
          trainer: "Alex Johnson",
        },
        {
          time: "12:00 - 13:00",
          name: "Lunch Express HIIT",
          trainer: "David Park",
        },
        {
          time: "18:00 - 19:00",
          name: "Nutrition Workshop",
          trainer: "Jessica Rodriguez",
        },
        {
          time: "19:30 - 20:30",
          name: "Evening Pilates",
          trainer: "Sarah Williams",
        },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        {
          time: "06:00 - 07:00",
          name: "Morning CrossFit",
          trainer: "Marcus Chen",
        },
        {
          time: "10:00 - 11:00",
          name: "Recovery Yoga",
          trainer: "Sarah Williams",
        },
        {
          time: "17:30 - 18:30",
          name: "Advanced Strength",
          trainer: "Alex Johnson",
        },
        { time: "19:00 - 20:00", name: "Zumba", trainer: "Emma Wilson" },
      ],
    },
    {
      day: "Thursday",
      classes: [
        {
          time: "07:00 - 08:00",
          name: "Functional Training",
          trainer: "Alex Johnson",
        },
        {
          time: "12:00 - 13:00",
          name: "Lunch Express HIIT",
          trainer: "David Park",
        },
        {
          time: "18:00 - 19:00",
          name: "Metabolic Conditioning",
          trainer: "Marcus Chen",
        },
        {
          time: "19:30 - 20:30",
          name: "Evening Flow Yoga",
          trainer: "Sarah Williams",
        },
      ],
    },
    {
      day: "Friday",
      classes: [
        { time: "06:00 - 07:00", name: "Morning HIIT", trainer: "David Park" },
        {
          time: "10:00 - 11:00",
          name: "Strength & Conditioning",
          trainer: "Alex Johnson",
        },
        {
          time: "17:30 - 18:30",
          name: "CrossFit Open Gym",
          trainer: "Marcus Chen",
        },
        {
          time: "19:00 - 20:00",
          name: "Dance Fitness",
          trainer: "Emma Wilson",
        },
      ],
    },
    {
      day: "Saturday",
      classes: [
        {
          time: "09:00 - 10:00",
          name: "Weekend CrossFit",
          trainer: "Marcus Chen",
        },
        {
          time: "10:30 - 11:30",
          name: "Vinyasa Yoga",
          trainer: "Sarah Williams",
        },
        {
          time: "12:00 - 13:00",
          name: "Nutrition Basics",
          trainer: "Jessica Rodriguez",
        },
        { time: "14:00 - 15:00", name: "HIIT & Core", trainer: "David Park" },
      ],
    },
    {
      day: "Sunday",
      classes: [
        {
          time: "10:00 - 11:00",
          name: "Recovery Yoga",
          trainer: "Sarah Williams",
        },
        {
          time: "11:30 - 12:30",
          name: "Dance Fitness",
          trainer: "Emma Wilson",
        },
        { time: "14:00 - 15:00", name: "Open Gym", trainer: "All Trainers" },
      ],
    },
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const teamCardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      y: -10,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const [visibleDay, setVisibleDay] = useState("Monday");

  return (
    <>
      <motion.div
        ref={containerRef}
        style={{ backgroundColor }}
        className="w-full bg-background"
      >
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-black text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40 z-0">
            <div
              style={{
                backgroundImage: `url('/api/placeholder/1920/1080')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                width: "100%",
                height: "100%",
              }}
            ></div>
          </div>

          <motion.div
            className="container mx-auto px-8 relative z-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {t("Meet Our Expert Team")}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t(
                "Dedicated professionals committed to guiding your fitness journey with expertise and passion"
              )}
            </motion.p>
            <motion.button
              className="px-8 py-3 bg-[#FFFDF2] text-black font-semibold rounded-md text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => confettiRef.current?.fire({})}
            >
              {t("Book a Session")}
            </motion.button>
          </motion.div>

          {/* Scroll indicator - moved outside the container and positioned relative to the section */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
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
          <Confetti
            ref={confettiRef}
            className="absolute left-0 top-0 z-0 h-full w-full"
          />
        </section>

        {/* Our Philosophy Section */}
        <section className="py-20 bg-[#FFFDF2] relative overflow-hidden">
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full w-full h-full"
            squareSize={6}
            gridGap={10}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
          />
          <div className="container mx-auto px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="lg:w-1/2 border border-gray-200 rounded-xl backdrop-blur-xs backdrop-brightness-100 backdrop-opacity-80 bg-white/30 p-8 shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0.6 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-black mb-6">
                  {t("Our Team Philosophy")}
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  {t(
                    "We believe fitness is a journey, not a destination. Our team of experts is committed to walking alongside you every step of the way, providing personalized guidance that adapts to your evolving needs and goals."
                  )}
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  {t(
                    "Each of our trainers brings specialized expertise, but shares a common commitment to evidence-based methods, continuous learning, and genuine care for our members' success."
                  )}
                </p>
                <ul className="space-y-2">
                  {[
                    "Personalized attention to your unique needs",
                    "Continuous education in the latest fitness science",
                    "Supportive community building approach",
                    "Holistic view of health and wellness",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <svg
                        className="w-5 h-5 mt-1 mr-2 text-black"
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
                      <span className="text-gray-700">{t(item)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="lg:w-1/2 w-full mt-12 lg:mt-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Animated image container with gradient border */}
                <div className="relative mx-auto max-w-md">
                  {/* Image container */}
                  <div className="relative mx-auto max-w-sm sm:max-w-md rounded-2xl overflow-hidden">
                    <BorderBeam
                      duration={6}
                      size={400}
                      className="from-transparent via-red-500 to-transparent"
                    />
                    <BorderBeam
                      duration={6}
                      delay={3}
                      size={400}
                      className="from-transparent via-blue-500 to-transparent"
                    />

                    <div className="relative" style={{ paddingBottom: "125%" }}>
                      <img
                        src="/photos/background.jpg"
                        alt="Team training session"
                        className="absolute w-full h-full object-cover p-1 rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Experience badge */}
                  <div className="absolute -bottom-6 left-0 sm:-left-6 w-32 sm:w-40 h-32 sm:h-40 bg-black rounded-full flex items-center justify-center shadow-lg z-10">
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 10 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <p className="text-white font-bold text-base sm:text-lg text-center">
                        20+ Years
                        <br />
                        Combined
                        <br />
                        Experience
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-20 bg-[#FFFDF2] relative overflow-hidden">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-black mb-4">
                {t("Our Fitness Experts")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t(
                  "Meet the dedicated professionals who will guide and support your fitness journey"
                )}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200"
                  variants={teamCardVariants}
                  whileHover="hover"
                  onClick={() =>
                    setActiveTrainer(
                      activeTrainer === member.id ? null : member.id
                    )
                  }
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-[#FFFDF2]">{member.role}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-black text-[#FFFDF2] px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 mb-4">{member.bio}</p>

                    <motion.div
                      className="overflow-hidden"
                      animate={{
                        height: activeTrainer === member.id ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-bold text-black mb-2">
                          Certifications:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 mb-4">
                          {member.certifications.map((cert, idx) => (
                            <li key={idx}>{cert}</li>
                          ))}
                        </ul>

                        <div className="flex space-x-4">
                          <a
                            href={`https://instagram.com/${member.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-pink-600"
                          >
                            <FaInstagram size={24} />
                          </a>
                          <a
                            href={`https://twitter.com/${member.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-400"
                          >
                            <FaTwitter size={24} />
                          </a>
                          <a
                            href={`https://linkedin.com/in/${member.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-700"
                          >
                            <FaLinkedin size={24} />
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      className="mt-4 w-full py-2 bg-black text-[#FFFDF2] rounded-md font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {activeTrainer === member.id ? "Show Less" : "Read More"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Weekly Schedule Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">
                {t("Weekly Class Schedule")}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t("Join our expert-led classes throughout the week")}
              </p>
            </motion.div>

            <div className="flex flex-wrap mb-8 justify-center">
              {weeklySchedule.map((day) => (
                <motion.button
                  key={day.day}
                  className={`px-4 py-2 m-1 rounded-md font-medium ${
                    visibleDay === day.day
                      ? "bg-[#FFFDF2] text-black"
                      : "bg-gray-800 text-white"
                  }`}
                  onClick={() => setVisibleDay(day.day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {day.day}
                </motion.button>
              ))}
            </div>

            <div className="overflow-hidden bg-gray-900 rounded-lg shadow-xl">
              {weeklySchedule.map((day) => (
                <motion.div
                  key={day.day}
                  className="p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: visibleDay === day.day ? 1 : 0,
                    x: visibleDay === day.day ? 0 : 20,
                    display: visibleDay === day.day ? "block" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-[#FFFDF2]">
                    {day.day}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.classes.map((classItem, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-gray-800 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-[#FFFDF2]">
                              {classItem.name}
                            </h4>
                            <p className="text-gray-400">
                              Instructor: {classItem.trainer}
                            </p>
                          </div>
                          <span className="bg-black px-3 py-1 rounded-md text-sm text-[#FFFDF2]">
                            {classItem.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Stats Section */}
        <section className="py-20 bg-[#FFFDF2]">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "20+", label: "Expert Trainers" },
                { number: "50+", label: "Certifications" },
                { number: "1000+", label: "Happy Members" },
                { number: "30+", label: "Weekly Classes" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-5xl md:text-6xl font-bold text-black mb-2"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-xl text-gray-600">{t(stat.label)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                {t("Ready to Train With Our Expert Team?")}
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                {t(
                  "Book a session with one of our professional trainers and take the first step toward achieving your fitness goals."
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  className="px-8 py-3 bg-[#FFFDF2] text-black font-semibold rounded-md text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => confettiRef.current?.fire({})}
                >
                  {t("Book a Session")}
                </motion.button>
                <motion.button
                  className="px-8 py-3 border-2 border-[#FFFDF2] text-[#FFFDF2] font-semibold rounded-md text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("View Full Schedule")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Team;
