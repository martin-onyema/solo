"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, Handshake, Clock } from "lucide-react";
import Image from "next/image";

const highlights = [
  {
    icon: Shield,
    title: "Trusted Advisors",
    description:
      "Our team of seasoned professionals provides reliable guidance at every step, ensuring your investment decisions are backed by expertise and integrity.",
  },
  {
    icon: Award,
    title: "Years of Excellence",
    description:
      "With over a decade in the premium real estate market, we have cultivated deep industry knowledge and an unmatched portfolio of luxury properties.",
  },
  {
    icon: Handshake,
    title: "Seamless Process",
    description:
      "From initial consultation to property handover, we deliver a smooth, transparent transaction experience that eliminates the stress from buying or selling property.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We respect your time and investment. Every project and transaction is handled with precision and delivered within agreed timelines, without compromise on quality.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Section divider */}
      <div className="section-divider" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/about-bg.png"
                alt="Solo Luxury Properties team"
                fill
                className="object-cover"
                quality={85}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -right-4 sm:right-6 glass gold-glow-subtle p-6 max-w-[200px]"
            >
              <div
                className="text-3xl font-bold text-[#C2A75C] mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                12+
              </div>
              <div className="text-[#B0B0B0] text-sm">
                Years of Trusted Service
              </div>
            </motion.div>

            {/* Decorative corner */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C2A75C]/40" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C2A75C]/40 sm:hidden lg:block" />
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
                About Us
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Redefining Luxury
                <br />
                <span className="text-gradient-gold">Real Estate</span>
              </h2>
              <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-4">
                Solo Luxury Properties is a premium real estate firm based in
                Nsukka, Enugu State, Nigeria. We specialize in curating
                exceptional property experiences — from sprawling residential
                estates and prime commercial spaces to investment-grade land
                opportunities.
              </p>
              <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-10">
                Our philosophy is built on a foundation of trust, transparency,
                and an unwavering commitment to delivering value. Every
                transaction we facilitate is guided by expert counsel and a deep
                understanding of the market, ensuring our clients make
                confident, informed decisions that yield lasting returns.
              </p>
            </motion.div>

            {/* Highlight cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="group p-4 rounded-sm border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] transition-all duration-500"
                >
                  <item.icon className="w-6 h-6 text-[#C2A75C] mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h4
                    className="text-[#EAEAEA] font-semibold text-sm mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[#B0B0B0] text-xs leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
