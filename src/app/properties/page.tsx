"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ChevronDown,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, propertyTypes, cities } from "@/lib/data";

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
  features: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeCity, setActiveCity] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType !== "All") params.set("type", activeType);
      if (activeCity !== "All") params.set("city", activeCity);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      console.log("API RESPONSE:", data);
      
      // SAFE handling
      if (Array.isArray(data)) {
        setProperties(data);
      } else if (Array.isArray(data?.properties)) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, [activeType, activeCity, minPrice, maxPrice, searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveType("All");
    setActiveCity("All");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    activeType !== "All" ||
    activeCity !== "All" ||
    minPrice ||
    maxPrice ||
    searchQuery;

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="relative pt-24 pb-12 border-b border-[#C2A75C]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 to-[#0D0D0D]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#C2A75C] text-xs tracking-[0.3em] uppercase font-semibold">
              Browse Our Portfolio
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mt-3 mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              All <span className="text-gradient-gold">Properties</span>
            </h1>
            <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl">
              Explore our complete collection of premium properties across Enugu
              State. Use the filters below to find your perfect match.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-sm p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C2A75C]" />
              <input
                type="text"
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/50 pl-10 pr-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
              />
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {propertyTypes.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveType(filter)}
                  className={`px-3 py-2 text-xs tracking-wider uppercase transition-all duration-300 rounded-sm ${
                    activeType === filter
                      ? "bg-[#C2A75C] text-[#0D0D0D] font-semibold"
                      : "bg-[#252525] text-[#B0B0B0] hover:text-[#EAEAEA] hover:bg-[#1A1A1A]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Toggle filters & view */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-2 text-xs tracking-wider uppercase transition-all duration-300 rounded-sm border ${
                  showFilters
                    ? "border-[#C2A75C] text-[#C2A75C] bg-[#C2A75C]/10"
                    : "border-[#C2A75C]/15 text-[#B0B0B0] hover:text-[#C2A75C]"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 border border-[#C2A75C]/15 text-[#B0B0B0] hover:text-[#C2A75C] transition-colors duration-300 rounded-sm"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3X3 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-4 gap-4 pt-4 mt-4 border-t border-[#C2A75C]/10">
                  {/* City */}
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                      City
                    </label>
                    <select
                      value={activeCity}
                      onChange={(e) => setActiveCity(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors duration-300 rounded-sm appearance-none"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                      Min Price (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10,000,000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/50 px-3 py-2.5 text-sm outline-none transition-colors duration-300 rounded-sm"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-2 block">
                      Max Price (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 200,000,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/50 px-3 py-2.5 text-sm outline-none transition-colors duration-300 rounded-sm"
                    />
                  </div>

                  {/* Clear */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-[#C2A75C] hover:text-[#D4BC7A] text-xs tracking-wider uppercase transition-colors duration-300"
                      >
                        <X className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#B0B0B0] text-sm">
            {loading ? (
              "Searching..."
            ) : (
              <>
                Showing{" "}
                <span className="text-[#C2A75C] font-semibold">
                  {properties.length}
                </span>{" "}
                {properties.length === 1 ? "property" : "properties"}
              </>
            )}
          </p>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#252525]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[#252525] rounded w-3/4" />
                  <div className="h-4 bg-[#252525] rounded w-1/2" />
                  <div className="h-4 bg-[#252525] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="text-2xl text-[#B0B0B0] mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              No properties found
            </p>
            <p className="text-[#B0B0B0]/60 text-sm">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {Array.isArray(properties) && properties.length > 0 ? (
  properties.map((property, index) => (
    <motion.div key={property.id}>
      {/* your content */}
    </motion.div>
  ))
) : (
  <p>No properties found</p>
)}
                <Link
                  href={`/properties/${property.id}`}
                  className="group block bg-[#1A1A1A] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#C2A75C]/5"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
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
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/properties/${property.id}`}
                  className="group flex flex-col sm:flex-row bg-[#1A1A1A] border border-[#C2A75C]/10 hover:border-[#C2A75C]/30 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#C2A75C]/5"
                >
                  {/* Image */}
                  <div className="relative sm:w-72 aspect-[4/3] sm:aspect-auto overflow-hidden flex-shrink-0">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      quality={80}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#C2A75C] text-[#0D0D0D] text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5">
                        {property.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3
                          className="text-xl font-semibold text-[#EAEAEA] group-hover:text-[#C2A75C] transition-colors duration-300"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {property.title}
                        </h3>
                        <span
                          className="text-lg font-bold text-[#C2A75C] whitespace-nowrap"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#B0B0B0] text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#C2A75C]" />
                        {property.location}
                      </div>
                      <p className="text-[#B0B0B0] text-sm leading-relaxed line-clamp-2 mb-4">
                        {property.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
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
                      <span className="text-[#C2A75C] text-xs tracking-wider uppercase group-hover:underline flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
