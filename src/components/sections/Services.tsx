"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, TrendingUp, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Buying Property",
    description:
      "Find your dream home or investment property from our carefully curated portfolio. We guide you through every stage of the acquisition process — from initial search and property inspection to negotiation, documentation, and final handover. Our deep market knowledge ensures you secure the best value in every transaction.",
    features: [
      "Curated property listings",
      "Expert negotiation support",
      "Full documentation assistance",
      "Post-purchase support",
    ],
  },
  {
    icon: TrendingUp,
    title: "Selling Property",
    description:
      "Maximize the value of your property with our premium selling services. We employ strategic marketing, professional staging, and targeted outreach to connect your property with qualified buyers. Our transparent process ensures you receive fair market value with minimal hassle and maximum exposure across all relevant channels.",
    features: [
      "Strategic property marketing",
      "Professional valuation",
      "Qualified buyer matching",
      "Seamless closing process",
    ],
  },
  {
    icon: BarChart3,
    title: "Investment Advisory",
    description:
      "Make informed real estate investment decisions with our expert advisory services. We provide comprehensive market analysis, ROI projections, and portfolio diversification strategies tailored to your financial goals. Whether you are a first-time investor or expanding your portfolio, our insights position you for sustainable growth and profitability.",
    features: [
      "Market trend analysis",
      "ROI projections",
      "Portfolio diversification",
      "Risk assessment guidance",
    ],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="section-divider" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2A75C]/3 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
            What We Offer
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our <span className="text-gradient-gold">Services</span>
          </h2>
          <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl mx-auto">
            Comprehensive real estate solutions designed to make every
            transaction seamless, profitable, and stress-free.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="group relative bg-[#1A1A1A] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm p-8 transition-all duration-500 hover:shadow-lg hover:shadow-[#C2A75C]/5 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C2A75C] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-sm bg-[#C2A75C]/10 border border-[#C2A75C]/20 flex items-center justify-center mb-6 group-hover:bg-[#C2A75C]/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-[#C2A75C]" />
              </div>

              {/* Content */}
              <h3
                className="text-xl font-semibold text-[#EAEAEA] mb-4 group-hover:text-[#C2A75C] transition-colors duration-300"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {service.title}
              </h3>
              <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-[#B0B0B0] text-xs"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C2A75C]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
