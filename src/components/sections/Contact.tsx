"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, MapPin, Mail, MessageCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);

        // Auto-send to Instagram: open Instagram profile in new tab
        // The user can then message directly on Instagram
        const igMessage = encodeURIComponent(
          `Hello SOLO Luxury Properties!\n\nName: ${formState.name}\nEmail: ${formState.email}\nPhone: ${formState.phone}\n\nMessage: ${formState.message}`
        );
        // Open Instagram DM with pre-filled message text
        window.open(
          `https://www.instagram.com/solo_luxury_properties`,
          "_blank"
        );

        // Also open WhatsApp with the message pre-filled
        const whatsappMessage = encodeURIComponent(
          `Hello SOLO Luxury Properties!\n\nName: ${formState.name}\nEmail: ${formState.email}\nPhone: ${formState.phone}\n\nMessage: ${formState.message}`
        );
        window.open(
          `https://api.whatsapp.com/send/?phone=%2B2349030967002&text=${whatsappMessage}&type=phone_number&app_absent=0`,
          "_blank"
        );

        setTimeout(() => {
          setIsSubmitted(false);
          setFormState({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+234 903 096 7002",
      href: "tel:+2349030967002",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+234 903 096 7002",
      href: "https://api.whatsapp.com/send/?phone=%2B2349030967002&text&type=phone_number&app_absent=0",
    },
    {
      icon: Mail,
      label: "Instagram",
      value: "@solo_luxury_properties",
      href: "https://www.instagram.com/solo_luxury_properties",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Nsukka, Enugu State, Nigeria",
      href: "https://share.google/JD8nfIzjLMB6n3obQ",
    },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
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
            Get In Touch
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact <span className="text-gradient-gold">Us</span>
          </h2>
          <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl mx-auto">
            Ready to explore premium properties or need expert guidance? Reach
            out to us and let our team assist you on your real estate journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-sm border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#C2A75C]/10 border border-[#C2A75C]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C2A75C]/20 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-[#C2A75C]" />
                </div>
                <div>
                  <p className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-[#EAEAEA] text-sm font-medium">
                    {item.value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* Map placeholder */}
            <motion.a
              href="https://share.google/JD8nfIzjLMB6n3obQ"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#C2A75C]/10 block hover:border-[#C2A75C]/30 transition-colors duration-300"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15832.5!2d7.37!3d6.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1044d8f!2sNsukka!5e0!3m2!1sen!2sng!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(20%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/40 flex items-center justify-center hover:bg-transparent transition-all duration-500">
                <div className="text-center hover:opacity-0 transition-opacity duration-500">
                  <MapPin className="w-8 h-8 text-[#C2A75C] mx-auto mb-2" />
                  <p
                    className="text-[#EAEAEA] text-sm font-medium"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Nsukka, Enugu State
                  </p>
                  <p className="text-[#B0B0B0] text-xs mt-1">Click to open in Google Maps</p>
                </div>
              </div>
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-sm p-6 sm:p-8 gold-glow-subtle"
            >
              <h3
                className="text-xl font-semibold text-[#EAEAEA] mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Send Us a Message
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                  placeholder="+234 800 000 0000"
                  className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                />
              </div>

              <div className="mb-6">
                <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                  Your Message
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Tell us about your property needs..."
                  required
                  rows={5}
                  className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitted || isSubmitting}
                className={`w-full py-6 rounded-none font-semibold tracking-wider text-sm uppercase transition-all duration-300 ${
                  isSubmitted
                    ? "bg-green-600 text-white"
                    : "bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A]"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Message Sent Successfully
                  </>
                ) : isSubmitting ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
