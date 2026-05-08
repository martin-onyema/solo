"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/#home", label: "Home", isHash: true },
  { href: "/#about", label: "About", isHash: true },
  { href: "/properties", label: "Properties", isHash: false },
  { href: "/#services", label: "Services", isHash: true },
  { href: "/#why-us", label: "Why Us", isHash: true },
  { href: "/#testimonials", label: "Testimonials", isHash: true },
  { href: "/#contact", label: "Contact", isHash: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string, isHash: boolean) => {
    setIsMobileMenuOpen(false);
    if (isHash && isHome) {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? "glass-strong py-3 shadow-lg shadow-black/20"
            : "bg-gradient-to-b from-[#0D0D0D]/80 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#C2A75C] flex items-center justify-center">
              <span
                className="text-[#0D0D0D] font-bold text-lg"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                S
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-[#EAEAEA] text-lg font-semibold tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                SOLO
              </span>
              <span className="text-[#C2A75C] text-[10px] tracking-[0.3em] uppercase">
                Luxury Properties
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href, link.isHash)}
                className="text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm tracking-wide uppercase relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C2A75C] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+2349030967002"
              className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+234 903 096 7002</span>
            </a>
            <Link href="/#contact">
              <Button
                className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] transition-all duration-300 px-6 py-2 rounded-none font-semibold tracking-wide text-sm uppercase"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#EAEAEA] p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 glass-strong pt-24 px-6"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.href, link.isHash)}
                    className="text-[#EAEAEA] hover:text-[#C2A75C] transition-colors duration-300 text-xl tracking-wide uppercase"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="tel:+2349030967002"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B2349030967002&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/solo_luxury_properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
              <Link href="/#contact">
                <Button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] transition-all duration-300 px-8 py-3 rounded-none font-semibold tracking-wide text-sm uppercase mt-4"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
