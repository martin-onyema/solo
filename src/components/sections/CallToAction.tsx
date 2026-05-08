"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="section-divider" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-sm overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C2A75C]/20 via-[#0D0D0D] to-[#1A1A1A]" />
          <div className="absolute inset-0 noise-overlay" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2A75C]/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C2A75C]/5 rounded-full blur-[60px]" />

          {/* Gold line accents */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C2A75C]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C2A75C]/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 py-16 sm:py-20 px-6 sm:px-12 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold"
            >
              Start Your Journey
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#EAEAEA] mt-4 mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to Invest in
              <br />
              <span className="text-gradient-gold">
                Your Dream Property?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-[#B0B0B0] text-base sm:text-lg max-w-xl mx-auto mb-10"
            >
              Take the first step toward owning a premium property. Our team is
              ready to guide you through every stage of the process.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={() => handleScroll("#contact")}
                className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] transition-all duration-300 px-10 py-6 rounded-none font-semibold tracking-wider text-sm uppercase group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                onClick={() => handleScroll("#properties")}
                variant="outline"
                className="border-[#C2A75C]/40 text-[#C2A75C] hover:bg-[#C2A75C]/10 hover:border-[#C2A75C] transition-all duration-300 px-10 py-6 rounded-none tracking-wider text-sm uppercase"
              >
                Browse Properties
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
