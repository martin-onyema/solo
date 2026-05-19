"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MapPin, Bed, Bath, Maximize, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/data";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  size: string;
  type: string;
  tag: string;
  image: string;
  featured: boolean;
  status: string;
}

const filters = ["All", "Residential", "Commercial", "Land"];

export default function Properties() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          // Filter out empty/invalid properties and only show available + featured
          const valid = data.filter(
            (p: Property) => p.title && p.title.trim() !== "" && p.price > 0
          );
          // Show featured first, then limit to 6
          const sorted = valid.sort((a: Property, b: Property) =>
            a.featured === b.featured ? 0 : a.featured ? -1 : 1
          );
          setProperties(sorted.slice(0, 6));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesFilter =
      activeFilter === "All" || property.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="properties" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="section-divider" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
            Our Portfolio
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Featured <span className="text-gradient-gold">Properties</span>
          </h2>
          <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl mx-auto">
            Discover handpicked luxury properties across Enugu State. Each
            listing represents the pinnacle of quality, location, and
            investment potential.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-sm p-4 sm:p-6 mb-10"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C2A75C]" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/50 pl-10 pr-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C2A75C] hidden sm:block" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase transition-all duration-300 rounded-sm ${
                    activeFilter === filter
                      ? "bg-[#C2A75C] text-[#0D0D0D] font-semibold"
                      : "bg-[#252525] text-[#B0B0B0] hover:text-[#EAEAEA] hover:bg-[#1A1A1A]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loader
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#252525]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[#252525] rounded w-3/4" />
                  <div className="h-4 bg-[#252525] rounded w-1/2" />
                  <div className="h-4 bg-[#252525] rounded w-2/3" />
                </div>
              </div>
            ))
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[#B0B0B0]">No properties found matching your criteria.</p>
            </div>
          ) : (
            filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group relative bg-[#1A1A1A] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#C2A75C]/5"
              >
                {/* Image */}
// NEW:
<Image
  src={property.image || "/images/property-1.png"}
  alt={property.title}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.endsWith("/images/property-1.png")) {
      target.src = "/images/property-1.png";
    }
  }}
/>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C2A75C] text-[#0D0D0D] text-[10px] tracking-widest uppercase font-semibold px-3 py-1">
                      {property.tag}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-xl sm:text-2xl font-bold text-[#EAEAEA] gold-glow-text"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="text-lg font-semibold text-[#EAEAEA] mb-2 group-hover:text-[#C2A75C] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[#B0B0B0] text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#C2A75C]" />
                    {property.location}
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#C2A75C]/10">
                    {property.beds > 0 && (
                      <div className="flex items-center gap-1.5 text-[#B0B0B0] text-xs">
                        <Bed className="w-3.5 h-3.5 text-[#C2A75C]" />
                        {property.beds} Beds
                      </div>
                    )}
                    {property.baths > 0 && (
                      <div className="flex items-center gap-1.5 text-[#B0B0B0] text-xs">
                        <Bath className="w-3.5 h-3.5 text-[#C2A75C]" />
                        {property.baths} Baths
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[#B0B0B0] text-xs">
                      <Maximize className="w-3.5 h-3.5 text-[#C2A75C]" />
                      {property.size}
                    </div>
                  </div>
                </div>

                {/* Hover overlay with CTA */}
                <Link href={`/properties/${property.id}`} className="absolute inset-0 bg-[#0D0D0D]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Button className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] transition-all duration-300 px-6 py-3 rounded-none font-semibold tracking-wider text-sm uppercase">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <Button
              variant="outline"
              className="border-[#C2A75C]/40 text-[#C2A75C] hover:bg-[#C2A75C]/10 hover:border-[#C2A75C] transition-all duration-300 px-10 py-6 rounded-none tracking-wider text-sm uppercase group"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
