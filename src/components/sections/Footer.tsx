"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ArrowUp, Shield } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

const propertyLinks = [
  { label: "Residential", href: "/properties?type=Residential" },
  { label: "Commercial", href: "/properties?type=Commercial" },
  { label: "Land", href: "/properties?type=Land" },
  { label: "Investment", href: "/properties?tag=Investment" },
];

const socialLinks = [
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=%2B2349030967002&text&type=phone_number&app_absent=0",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/solo_luxury_properties",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 pb-8 bg-[#0A0A0A] border-t border-[#C2A75C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C2A75C] flex items-center justify-center">
                <span
                  className="text-[#0D0D0D] font-bold text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  S
                </span>
              </div>
              <div>
                <span
                  className="text-[#EAEAEA] text-lg font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  SOLO
                </span>
                <span className="block text-[#C2A75C] text-[10px] tracking-[0.3em] uppercase">
                  Luxury Properties
                </span>
              </div>
            </div>
            <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">
              Premium real estate solutions in Enugu State, Nigeria. Trusted
              advisors for buying, selling, and investing in luxury properties.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm border border-[#C2A75C]/15 hover:border-[#C2A75C]/40 flex items-center justify-center text-[#B0B0B0] hover:text-[#C2A75C] transition-all duration-300 hover:bg-[#C2A75C]/10"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[#EAEAEA] font-semibold mb-4 text-sm tracking-wider uppercase"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4
              className="text-[#EAEAEA] font-semibold mb-4 text-sm tracking-wider uppercase"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Properties
            </h4>
            <ul className="space-y-2">
              {propertyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[#EAEAEA] font-semibold mb-4 text-sm tracking-wider uppercase"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+2349030967002"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +234 903 096 7002
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B2349030967002&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/solo_luxury_properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  @solo_luxury_properties
                </a>
              </li>
              <li>
                <a
                  href="https://share.google/JD8nfIzjLMB6n3obQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Nsukka, Enugu State, Nigeria
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C2A75C]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#B0B0B0]/60 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Solo Luxury Properties. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Admin link - subtle shield icon */}
            <Link
              href="/admin"
              className="w-9 h-9 rounded-sm border border-[#C2A75C]/8 hover:border-[#C2A75C]/25 flex items-center justify-center text-[#B0B0B0]/30 hover:text-[#C2A75C]/60 transition-all duration-300 hover:bg-[#C2A75C]/5 group"
              aria-label="Admin Dashboard"
              title="Admin"
            >
              <Shield className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-sm border border-[#C2A75C]/15 hover:border-[#C2A75C]/40 flex items-center justify-center text-[#C2A75C] transition-all duration-300 hover:bg-[#C2A75C]/10 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
