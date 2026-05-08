"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  TreePine,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/data";

interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: string;
  tag: string;
  beds: number;
  baths: number;
  size: string;
  image: string;
  images: string;
  features: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const fetchProperty = useCallback(async () => {
    try {
      const res = await fetch(`/api/properties/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiryForm,
          propertyId: property?.id,
        }),
      });
      setInquirySubmitted(true);

      // Auto-send to Instagram & WhatsApp
      const msg = encodeURIComponent(
        `Hello SOLO Luxury Properties!\n\nI'm interested in: ${property?.title}\n\nName: ${inquiryForm.name}\nEmail: ${inquiryForm.email}\nPhone: ${inquiryForm.phone}\n\nMessage: ${inquiryForm.message}`
      );
      window.open(
        `https://www.instagram.com/solo_luxury_properties`,
        "_blank"
      );
      window.open(
        `https://api.whatsapp.com/send/?phone=%2B2349030967002&text=${msg}&type=phone_number&app_absent=0`,
        "_blank"
      );

      setTimeout(() => {
        setInquirySubmitted(false);
        setInquiryForm({ name: "", email: "", phone: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#252525] rounded w-1/4 mb-6" />
            <div className="aspect-[16/9] bg-[#252525] rounded mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-[#252525] rounded w-3/4" />
                <div className="h-4 bg-[#252525] rounded w-1/2" />
                <div className="h-32 bg-[#252525] rounded" />
              </div>
              <div className="h-96 bg-[#252525] rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1
            className="text-3xl font-bold text-[#EAEAEA] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Property Not Found
          </h1>
          <p className="text-[#B0B0B0] mb-8">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/properties">
            <Button className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] px-8 py-3 rounded-none font-semibold tracking-wider text-sm uppercase">
              Browse Properties
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const images: string[] = JSON.parse(property.images || "[]");
  const features: string[] = JSON.parse(property.features || "[]");
  const allImages =
    images.length > 0 ? images : [property.image];

  const typeIcon =
    property.type === "Residential"
      ? Home
      : property.type === "Commercial"
      ? Building2
      : TreePine;

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Back nav */}
      <div className="pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 text-sm py-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/9] sm:aspect-[2/1] rounded-sm overflow-hidden mb-3"
        >
          <Image
            src={allImages[activeImage]}
            alt={property.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/40 via-transparent to-transparent" />

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImage(
                    (activeImage - 1 + allImages.length) % allImages.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-[#EAEAEA] hover:text-[#C2A75C] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveImage((activeImage + 1) % allImages.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-[#EAEAEA] hover:text-[#C2A75C] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#C2A75C] text-[#0D0D0D] text-[10px] tracking-widest uppercase font-semibold px-3 py-1">
              {property.tag}
            </span>
            {property.status !== "available" && (
              <span
                className={`text-[10px] tracking-widest uppercase font-semibold px-3 py-1 ${
                  property.status === "sold"
                    ? "bg-red-600 text-white"
                    : "bg-yellow-600 text-black"
                }`}
              >
                {property.status}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                isFavorite
                  ? "text-red-500 bg-red-500/20"
                  : "text-[#EAEAEA] hover:text-[#C2A75C]"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#EAEAEA] hover:text-[#C2A75C] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-full text-[#EAEAEA] text-xs">
            {activeImage + 1} / {allImages.length}
          </div>
        </motion.div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-14 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                  idx === activeImage
                    ? "border-[#C2A75C]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${property.title} view ${idx + 1}`}
                  fill
                  className="object-cover"
                  quality={60}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Title & Price */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-[#B0B0B0]">
                    <MapPin className="w-4 h-4 text-[#C2A75C]" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-2xl sm:text-3xl font-bold text-[#C2A75C]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>

              {/* Property Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {property.beds > 0 && (
                  <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-4 text-center">
                    <Bed className="w-5 h-5 text-[#C2A75C] mx-auto mb-2" />
                    <span className="text-[#EAEAEA] font-semibold block">
                      {property.beds}
                    </span>
                    <span className="text-[#B0B0B0] text-xs uppercase tracking-wider">
                      Bedrooms
                    </span>
                  </div>
                )}
                {property.baths > 0 && (
                  <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-4 text-center">
                    <Bath className="w-5 h-5 text-[#C2A75C] mx-auto mb-2" />
                    <span className="text-[#EAEAEA] font-semibold block">
                      {property.baths}
                    </span>
                    <span className="text-[#B0B0B0] text-xs uppercase tracking-wider">
                      Bathrooms
                    </span>
                  </div>
                )}
                <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-4 text-center">
                  <Maximize className="w-5 h-5 text-[#C2A75C] mx-auto mb-2" />
                  <span className="text-[#EAEAEA] font-semibold block">
                    {property.size}
                  </span>
                  <span className="text-[#B0B0B0] text-xs uppercase tracking-wider">
                    Area
                  </span>
                </div>
                <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-4 text-center">
                  {(() => {
                    const TypeIcon = typeIcon;
                    return <TypeIcon className="w-5 h-5 text-[#C2A75C] mx-auto mb-2" />;
                  })()}
                  <span className="text-[#EAEAEA] font-semibold block">
                    {property.type}
                  </span>
                  <span className="text-[#B0B0B0] text-xs uppercase tracking-wider">
                    Type
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2
                  className="text-xl font-semibold text-[#EAEAEA] mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Description
                </h2>
                <p className="text-[#B0B0B0] leading-relaxed text-sm sm:text-base">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-xl font-semibold text-[#EAEAEA] mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Features & Amenities
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-3"
                      >
                        <CheckCircle className="w-4 h-4 text-[#C2A75C] flex-shrink-0" />
                        <span className="text-[#EAEAEA] text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="mb-8">
                <h2
                  className="text-xl font-semibold text-[#EAEAEA] mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Property Details
                </h2>
                <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm divide-y divide-[#C2A75C]/10">
                  <div className="flex justify-between p-4">
                    <span className="text-[#B0B0B0] text-sm flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#C2A75C]" />
                      Property ID
                    </span>
                    <span className="text-[#EAEAEA] text-sm font-mono">
                      SLP-{property.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-[#B0B0B0] text-sm flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#C2A75C]" />
                      Type
                    </span>
                    <span className="text-[#EAEAEA] text-sm">
                      {property.type}
                    </span>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-[#B0B0B0] text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C2A75C]" />
                      Location
                    </span>
                    <span className="text-[#EAEAEA] text-sm">
                      {property.location}
                    </span>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-[#B0B0B0] text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C2A75C]" />
                      Listed
                    </span>
                    <span className="text-[#EAEAEA] text-sm">
                      {new Date(property.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-[#B0B0B0] text-sm flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-[#C2A75C]" />
                      Size
                    </span>
                    <span className="text-[#EAEAEA] text-sm">
                      {property.size}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Inquiry Form & Contact */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-24 space-y-6"
            >
              {/* Quick Contact */}
              <div className="glass rounded-sm p-6 gold-glow-subtle">
                <h3
                  className="text-lg font-semibold text-[#EAEAEA] mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Interested in This Property?
                </h3>
                <div className="space-y-3 mb-6">
                  <a
                    href="tel:+2349030967002"
                    className="flex items-center gap-3 p-3 bg-[#0D0D0D] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm transition-all duration-300 group"
                  >
                    <Phone className="w-4 h-4 text-[#C2A75C]" />
                    <span className="text-[#EAEAEA] text-sm group-hover:text-[#C2A75C] transition-colors">
                      +234 903 096 7002
                    </span>
                  </a>
                  <a
                    href="https://api.whatsapp.com/send/?phone=%2B2349030967002&text&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#0D0D0D] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm transition-all duration-300 group"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C2A75C]" />
                    <span className="text-[#EAEAEA] text-sm group-hover:text-[#C2A75C] transition-colors">
                      WhatsApp
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com/solo_luxury_properties"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#0D0D0D] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm transition-all duration-300 group"
                  >
                    <Mail className="w-4 h-4 text-[#C2A75C]" />
                    <span className="text-[#EAEAEA] text-sm group-hover:text-[#C2A75C] transition-colors">
                      Instagram
                    </span>
                  </a>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6">
                <h3
                  className="text-lg font-semibold text-[#EAEAEA] mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Schedule a Viewing
                </h3>
                <form onSubmit={handleInquiry} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, name: e.target.value })
                    }
                    required
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, email: e.target.value })
                    }
                    required
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={inquiryForm.phone}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, phone: e.target.value })
                    }
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                  <textarea
                    placeholder="Your message or preferred viewing time..."
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        message: e.target.value,
                      })
                    }
                    required
                    rows={4}
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm resize-none"
                  />
                  <Button
                    type="submit"
                    disabled={inquirySubmitted}
                    className={`w-full py-3 rounded-none font-semibold tracking-wider text-sm uppercase transition-all duration-300 ${
                      inquirySubmitted
                        ? "bg-green-600 text-white"
                        : "bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A]"
                    }`}
                  >
                    {inquirySubmitted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Inquiry Sent!
                      </>
                    ) : (
                      "Schedule Viewing"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
