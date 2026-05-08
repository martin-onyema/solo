"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Users, BadgeDollarSign, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Building2,
    title: "Wide Range of Properties",
    description:
      "From luxury villas and modern apartments to prime commercial spaces and expansive land parcels, our diverse portfolio ensures you find the perfect match for your needs and investment goals. We continuously update our listings to provide the freshest opportunities in the market.",
    stat: "150+",
    statLabel: "Listed Properties",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description:
      "Our seasoned real estate professionals bring decades of combined experience and deep local market knowledge to every client interaction. We provide personalized consultations, strategic advice, and hands-on support that transforms complex property decisions into confident, well-informed choices.",
    stat: "24/7",
    statLabel: "Client Support",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    description:
      "We leverage our extensive network and market intelligence to secure the most favorable terms for our clients. Whether buying or selling, our pricing strategies are designed to maximize your return on investment while ensuring fair market value and complete financial transparency.",
    stat: "15%",
    statLabel: "Avg. Savings",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Honest Service",
    description:
      "Integrity is the cornerstone of every transaction we handle. We maintain full transparency throughout the entire process — from pricing and documentation to negotiations and closing. No hidden fees, no surprises, just honest, straightforward service that builds lasting trust with every client.",
    stat: "98%",
    statLabel: "Trust Rating",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="section-divider" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
            Why Solo
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Why Choose <span className="text-gradient-gold">Us</span>
          </h2>
          <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl mx-auto">
            We don&apos;t just sell properties — we build relationships,
            cultivate trust, and deliver exceptional value at every touchpoint.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.12 }}
              className="group relative bg-[#1A1A1A] border border-[#C2A75C]/10 hover:border-[#C2A75C]/25 rounded-sm overflow-hidden transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Left side with stat */}
                <div className="sm:w-44 p-6 sm:p-8 flex flex-col items-center justify-center bg-[#C2A75C]/5 border-b sm:border-b-0 sm:border-r border-[#C2A75C]/10 group-hover:bg-[#C2A75C]/10 transition-colors duration-500">
                  <reason.icon className="w-8 h-8 text-[#C2A75C] mb-3" />
                  <span
                    className="text-2xl sm:text-3xl font-bold text-[#C2A75C]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {reason.stat}
                  </span>
                  <span className="text-[#B0B0B0] text-[10px] tracking-wider uppercase mt-1">
                    {reason.statLabel}
                  </span>
                </div>

                {/* Right side with content */}
                <div className="flex-1 p-6 sm:p-8">
                  <h3
                    className="text-lg sm:text-xl font-semibold text-[#EAEAEA] mb-3 group-hover:text-[#C2A75C] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {reason.title}
                  </h3>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
