"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Chukwuemeka Okafor",
    role: "Property Investor",
    text: "Solo Luxury Properties transformed my investment journey entirely. Their team identified a prime land opportunity in Nsukka that has since appreciated by over 40%. The professionalism, transparency, and follow-through were exceptional from start to finish.",
    rating: 5,
  },
  {
    id: 2,
    name: "Amara Eze",
    role: "Homeowner",
    text: "Finding our dream home in Enugu felt effortless with Solo. They understood exactly what we wanted, presented options that matched our vision perfectly, and guided us through every step of the purchase. We couldn't be happier with our new home.",
    rating: 5,
  },
  {
    id: 3,
    name: "Obinna Nnamani",
    role: "Commercial Developer",
    text: "As a developer, I need partners who understand market dynamics and can deliver on time. Solo Luxury Properties has consistently exceeded expectations. Their commercial listings are top-tier, and their advisory services have been instrumental in my portfolio growth.",
    rating: 5,
  },
  {
    id: 4,
    name: "Chioma Umeh",
    role: "First-time Buyer",
    text: "I was nervous about buying my first property, but the Solo team made the entire experience seamless and stress-free. They explained every detail, handled all the paperwork, and ensured I got the best possible deal. I highly recommend them to anyone.",
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="section-divider" />

      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C2A75C]/3 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
            Client Stories
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Clients <span className="text-gradient-gold">Say</span>
          </h2>
          <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl mx-auto">
            Real experiences from real clients. Our track record of excellence
            speaks through the voices of those we&apos;ve served.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass rounded-sm p-8 sm:p-12 gold-glow-subtle">
            {/* Quote icon */}
            <Quote className="w-10 h-10 text-[#C2A75C]/20 mb-6" />

            {/* Testimonial content */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="text-[#EAEAEA] text-lg sm:text-xl leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C2A75C]/20 border border-[#C2A75C]/30 flex items-center justify-center">
                  <span className="text-[#C2A75C] font-semibold text-lg">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-[#EAEAEA] font-semibold text-sm">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-[#C2A75C] text-xs">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-[#C2A75C]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-sm border border-[#C2A75C]/20 hover:border-[#C2A75C]/50 flex items-center justify-center text-[#C2A75C] transition-all duration-300 hover:bg-[#C2A75C]/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2 flex-1 justify-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-[#C2A75C]"
                        : "w-4 bg-[#C2A75C]/30 hover:bg-[#C2A75C]/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-sm border border-[#C2A75C]/20 hover:border-[#C2A75C]/50 flex items-center justify-center text-[#C2A75C] transition-all duration-300 hover:bg-[#C2A75C]/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
