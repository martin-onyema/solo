"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  Search,
  ArrowLeft,
  TrendingUp,
  Home,
  TreePine,
  BarChart3,
  Clock,
  AlertCircle,
  ChevronRight,
  Star,
  MessageSquare,
  MapPin,
  Lock,
  ShieldCheck,
  LogOut,
  Upload,
  ImageIcon,
  Loader2,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, propertyTags, propertyStatuses, generateSlug } from "@/lib/data";

/* ─── Types ────────────────────────────────────────────── */
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
  updatedAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string | null;
  property: Property | null;
  read: boolean;
  createdAt: string;
}

interface Stats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  pendingProperties: number;
  totalInquiries: number;
  unreadInquiries: number;
  featuredProperties: number;
  totalValue: number;
  propertiesByType: { type: string; count: number }[];
  propertiesByCity: { city: string; count: number }[];
}

/* ─── Tabs ─────────────────────────────────────────────── */
type Tab = "dashboard" | "properties" | "inquiries" | "settings";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "inquiries", label: "Inquiries", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
];

/* ─── Empty form ───────────────────────────────────────── */
const emptyForm = {
  title: "",
  description: "",
  price: 0,
  location: "",
  city: "Enugu",
  type: "Residential",
  tag: "Featured",
  beds: 0,
  baths: 0,
  size: "",
  image: "/images/property-1.png",
  images: [] as string[],
  features: [] as string[],
  featured: false,
  status: "available" as string,
};

/* ─── Auth User Info ─────────────────────────────────── */
interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

/* ─── Change Password Form ──────────────────────────── */
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to change password." });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div>
        <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
          placeholder="Enter current password"
        />
      </div>
      <div>
        <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
          placeholder="Enter new password"
        />
      </div>
      <div>
        <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
          placeholder="Confirm new password"
        />
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs flex items-center gap-1.5 pl-1 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {message.text}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#C2A75C] hover:bg-[#D4BC7A] text-[#0D0D0D] px-6 py-2.5 font-semibold tracking-wider text-xs uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Lock className="w-3.5 h-3.5" />
        )}
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}

/* ─── Component ────────────────────────────────────────── */
export default function AdminDashboard() {
  // Auth.js session — replaces custom auth state
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const authUser = session?.user
    ? {
        id: session.user.id || "",
        username: (session.user as { username?: string }).username || "",
        displayName: session.user.name || "Admin",
      }
    : null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth.js handles session automatically via useSession() — no manual check needed

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        setLoginError("Invalid credentials. Access denied.");
        setPassword("");
      } else {
        setLoginError("");
        setUsername("");
        setPassword("");
      }
    } catch (e) {
      console.error(e);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  // Property form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Upload state
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [mainDragOver, setMainDragOver] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);

  // Upload handler
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const data = await res.json();
        alert(data.error || "Upload failed");
        return null;
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed");
      return null;
    }
  };

  const handleMainImageUpload = async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;
    setUploadingMain(true);
    const url = await uploadFile(file);
    if (url) setForm({ ...form, image: url });
    setUploadingMain(false);
  };

  const handleGalleryUpload = async (files: FileList | File[]) => {
    setUploadingGallery(true);
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) newImages.push(url);
    }
    if (newImages.length > 0) {
      setForm({ ...form, images: [...form.images, ...newImages] });
    }
    setUploadingGallery(false);
  };

  // Fetch data
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) setProperties(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) setInquiries(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchProperties(), fetchInquiries()]);
    setLoading(false);
  }, [fetchStats, fetchProperties, fetchInquiries]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const doLoad = async () => {
      setLoading(true);
      try {
        const [statsRes, propsRes, inqRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/properties"),
          fetch("/api/inquiries"),
        ]);
        if (cancelled) return;
        if (statsRes.ok) setStats(await statsRes.json());
        if (propsRes.ok) setProperties(await propsRes.json());
        if (inqRes.ok) setInquiries(await inqRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doLoad();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // CRUD
  const handleSave = async () => {
    const payload = {
      ...form,
      slug: generateSlug(form.title),
      price: Number(form.price),
      beds: Number(form.beds),
      baths: Number(form.baths),
    };

    try {
      if (editingId) {
        await fetch(`/api/properties/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (p: Property) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      location: p.location,
      city: p.city,
      type: p.type,
      tag: p.tag,
      beds: p.beds,
      baths: p.baths,
      size: p.size,
      image: p.image,
      images: JSON.parse(p.images || "[]"),
      features: JSON.parse(p.features || "[]"),
      featured: p.featured,
      status: p.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE" });
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (p: Property) => {
    try {
      await fetch(`/api/properties/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (p: Property) => {
    const next =
      p.status === "available"
        ? "pending"
        : p.status === "pending"
        ? "sold"
        : "available";
    try {
      await fetch(`/api/properties/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  // Inquiry actions
  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      fetchInquiries();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      fetchInquiries();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter
  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== idx),
    });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] });
      setImageInput("");
    }
  };

  const removeImage = (idx: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== idx),
    });
  };

  /* ─── Render ─────────────────────────────────────────── */

  // Loading state while Auth.js checks session
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C2A75C] animate-spin" />
      </main>
    );
  }

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C2A75C]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C2A75C]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C2A75C]/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#C2A75C]/20 rounded-sm p-8 sm:p-10">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-[#C2A75C] mx-auto mb-5 flex items-center justify-center"
              >
                <ShieldCheck className="w-8 h-8 text-[#0D0D0D]" />
              </motion.div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                SOLO Admin
              </h1>
              <p className="text-[#B0B0B0] text-sm tracking-wide">
                Sign in to access the dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#C2A75C]/60" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Username"
                  autoFocus
                  className="w-full bg-[#0D0D0D]/60 border border-[#C2A75C]/20 focus:border-[#C2A75C]/50 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-300 rounded-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#C2A75C]/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Password"
                  className="w-full bg-[#0D0D0D]/60 border border-[#C2A75C]/20 focus:border-[#C2A75C]/50 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 pl-11 pr-12 py-3.5 text-sm outline-none transition-all duration-300 rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0B0B0]/50 hover:text-[#C2A75C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-xs flex items-center gap-1.5 pl-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {loginError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#C2A75C] hover:bg-[#D4BC7A] text-[#0D0D0D] py-3.5 font-semibold tracking-[0.15em] text-xs uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                {loginLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#C2A75C]/10 text-center">
              <Link
                href="/"
                className="text-[#B0B0B0]/60 hover:text-[#C2A75C] text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Website
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <main className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#C2A75C]/10 hidden lg:flex flex-col">
        <div className="p-6 border-b border-[#C2A75C]/10">
          <Link href="/" className="flex items-center gap-3 group">
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
                className="text-[#EAEAEA] text-sm font-semibold tracking-wide block"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                SOLO
              </span>
              <span className="text-[#C2A75C] text-[9px] tracking-[0.2em] uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-[#C2A75C]/15 text-[#C2A75C] border border-[#C2A75C]/20"
                  : "text-[#B0B0B0] hover:text-[#EAEAEA] hover:bg-[#1A1A1A] border border-transparent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === "inquiries" && stats && stats.unreadInquiries > 0 && (
                <span className="ml-auto bg-[#C2A75C] text-[#0D0D0D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats.unreadInquiries}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#C2A75C]/10 space-y-2">
          {authUser && (
            <div className="flex items-center gap-2 text-[#B0B0B0] text-xs px-0.5">
              <User className="w-3.5 h-3.5 text-[#C2A75C]/70" />
              <span>{authUser.displayName}</span>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#C2A75C] text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-[#B0B0B0] hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong py-3 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C2A75C] flex items-center justify-center">
            <span
              className="text-[#0D0D0D] font-bold text-sm"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              S
            </span>
          </div>
          <span className="text-[#EAEAEA] text-sm font-semibold">Admin</span>
        </Link>
        <div className="flex gap-1 items-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-2 rounded-sm transition-colors ${
                activeTab === tab.key
                  ? "text-[#C2A75C] bg-[#C2A75C]/15"
                  : "text-[#B0B0B0]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="p-2 rounded-sm text-[#B0B0B0] hover:text-red-400 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pt-0 pt-14">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            {/* ── DASHBOARD ─────────────────────────────────── */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Dashboard
                </h1>

                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6 animate-pulse"
                      >
                        <div className="h-4 bg-[#252525] rounded w-1/2 mb-3" />
                        <div className="h-8 bg-[#252525] rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : stats ? (
                  <>
                    {/* Stats cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6 hover:border-[#C2A75C]/25 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            Total Properties
                          </span>
                          <Building2 className="w-4 h-4 text-[#C2A75C]" />
                        </div>
                        <span
                          className="text-3xl font-bold text-[#C2A75C]"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {stats.totalProperties}
                        </span>
                      </div>
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6 hover:border-[#C2A75C]/25 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            Available
                          </span>
                          <Home className="w-4 h-4 text-green-500" />
                        </div>
                        <span
                          className="text-3xl font-bold text-green-500"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {stats.availableProperties}
                        </span>
                      </div>
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6 hover:border-[#C2A75C]/25 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            Total Inquiries
                          </span>
                          <Mail className="w-4 h-4 text-[#C2A75C]" />
                        </div>
                        <span
                          className="text-3xl font-bold text-[#C2A75C]"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {stats.totalInquiries}
                        </span>
                      </div>
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-6 hover:border-[#C2A75C]/25 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            Portfolio Value
                          </span>
                          <TrendingUp className="w-4 h-4 text-[#C2A75C]" />
                        </div>
                        <span
                          className="text-xl sm:text-2xl font-bold text-[#C2A75C]"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {formatPrice(stats.totalValue)}
                        </span>
                      </div>
                    </div>

                    {/* Secondary stats */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-[#C2A75C]" />
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            By Type
                          </span>
                        </div>
                        {stats.propertiesByType.map((item) => (
                          <div
                            key={item.type}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span className="text-[#EAEAEA] text-sm flex items-center gap-2">
                              {item.type === "Residential" ? (
                                <Home className="w-3 h-3 text-[#C2A75C]" />
                              ) : item.type === "Commercial" ? (
                                <Building2 className="w-3 h-3 text-[#C2A75C]" />
                              ) : (
                                <TreePine className="w-3 h-3 text-[#C2A75C]" />
                              )}
                              {item.type}
                            </span>
                            <span className="text-[#C2A75C] text-sm font-semibold">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-[#C2A75C]" />
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            By City
                          </span>
                        </div>
                        {stats.propertiesByCity.map((item) => (
                          <div
                            key={item.city}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span className="text-[#EAEAEA] text-sm">
                              {item.city}
                            </span>
                            <span className="text-[#C2A75C] text-sm font-semibold">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-[#C2A75C]" />
                          <span className="text-[#B0B0B0] text-xs tracking-wider uppercase">
                            Status
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[#EAEAEA] text-sm">
                            Available
                          </span>
                          <span className="text-green-500 text-sm font-semibold">
                            {stats.availableProperties}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[#EAEAEA] text-sm">
                            Pending
                          </span>
                          <span className="text-yellow-500 text-sm font-semibold">
                            {stats.pendingProperties}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[#EAEAEA] text-sm">Sold</span>
                          <span className="text-red-500 text-sm font-semibold">
                            {stats.soldProperties}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent inquiries */}
                    {inquiries.length > 0 && (
                      <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm">
                        <div className="p-5 border-b border-[#C2A75C]/10 flex items-center justify-between">
                          <h3 className="text-[#EAEAEA] font-semibold text-sm flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#C2A75C]" />
                            Recent Inquiries
                          </h3>
                          <button
                            onClick={() => setActiveTab("inquiries")}
                            className="text-[#C2A75C] text-xs hover:underline flex items-center gap-1"
                          >
                            View All
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        {inquiries.slice(0, 3).map((inq) => (
                          <div
                            key={inq.id}
                            className="p-5 border-b border-[#C2A75C]/5 last:border-0"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[#EAEAEA] text-sm font-medium">
                                    {inq.name}
                                  </span>
                                  {!inq.read && (
                                    <span className="w-2 h-2 rounded-full bg-[#C2A75C]" />
                                  )}
                                </div>
                                <p className="text-[#B0B0B0] text-xs mb-1">
                                  {inq.email}
                                </p>
                                <p className="text-[#B0B0B0] text-xs line-clamp-1">
                                  {inq.message}
                                </p>
                              </div>
                              <span className="text-[#B0B0B0]/60 text-[10px] whitespace-nowrap">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : null}
              </motion.div>
            )}

            {/* ── PROPERTIES ────────────────────────────────── */}
            {activeTab === "properties" && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-[#EAEAEA]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Properties
                  </h1>
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setShowForm(true);
                    }}
                    className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] px-5 py-2.5 rounded-none font-semibold tracking-wider text-xs uppercase"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Property
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C2A75C]" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/50 pl-10 pr-4 py-3 text-sm outline-none transition-colors duration-300 rounded-sm"
                  />
                </div>

                {/* Properties Table */}
                <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#C2A75C]/10">
                          <th className="text-left text-[#B0B0B0] text-xs tracking-wider uppercase p-4 font-medium">
                            Property
                          </th>
                          <th className="text-left text-[#B0B0B0] text-xs tracking-wider uppercase p-4 font-medium hidden sm:table-cell">
                            Type
                          </th>
                          <th className="text-left text-[#B0B0B0] text-xs tracking-wider uppercase p-4 font-medium hidden md:table-cell">
                            Price
                          </th>
                          <th className="text-left text-[#B0B0B0] text-xs tracking-wider uppercase p-4 font-medium hidden lg:table-cell">
                            Status
                          </th>
                          <th className="text-right text-[#B0B0B0] text-xs tracking-wider uppercase p-4 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProperties.map((p) => (
                          <tr
                            key={p.id}
                            className="border-b border-[#C2A75C]/5 hover:bg-[#252525]/50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                                  <Image
                                    src={p.image}
                                    alt={p.title}
                                    fill
                                    className="object-cover"
                                    quality={50}
                                  />
                                </div>
                                <div>
                                  <p
                                    className="text-[#EAEAEA] text-sm font-medium"
                                    style={{
                                      fontFamily: "var(--font-playfair)",
                                    }}
                                  >
                                    {p.title}
                                  </p>
                                  <p className="text-[#B0B0B0] text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {p.location}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden sm:table-cell">
                              <span className="text-[#B0B0B0] text-xs bg-[#252525] px-2 py-1 rounded-sm">
                                {p.type}
                              </span>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span className="text-[#C2A75C] text-sm font-semibold">
                                {formatPrice(p.price)}
                              </span>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <button
                                onClick={() => handleToggleStatus(p)}
                                className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-1 rounded-sm ${
                                  p.status === "available"
                                    ? "bg-green-500/15 text-green-500"
                                    : p.status === "pending"
                                    ? "bg-yellow-500/15 text-yellow-500"
                                    : "bg-red-500/15 text-red-500"
                                }`}
                              >
                                {p.status}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleToggleFeatured(p)}
                                  className={`p-1.5 rounded-sm transition-colors ${
                                    p.featured
                                      ? "text-[#C2A75C] bg-[#C2A75C]/15"
                                      : "text-[#B0B0B0] hover:text-[#C2A75C]"
                                  }`}
                                  title={
                                    p.featured
                                      ? "Remove from featured"
                                      : "Add to featured"
                                  }
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      p.featured ? "fill-current" : ""
                                    }`}
                                  />
                                </button>
                                <Link
                                  href={`/properties/${p.id}`}
                                  className="p-1.5 rounded-sm text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="p-1.5 rounded-sm text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-1.5 rounded-sm text-[#B0B0B0] hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredProperties.length === 0 && (
                    <div className="p-12 text-center">
                      <AlertCircle className="w-8 h-8 text-[#B0B0B0]/40 mx-auto mb-3" />
                      <p className="text-[#B0B0B0] text-sm">
                        No properties found
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── INQUIRIES ─────────────────────────────────── */}
            {activeTab === "inquiries" && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Inquiries
                </h1>

                {inquiries.length === 0 ? (
                  <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-12 text-center">
                    <Mail className="w-8 h-8 text-[#B0B0B0]/40 mx-auto mb-3" />
                    <p className="text-[#B0B0B0] text-sm">
                      No inquiries yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`bg-[#1A1A1A] border rounded-sm p-5 transition-all duration-300 ${
                          inq.read
                            ? "border-[#C2A75C]/5"
                            : "border-[#C2A75C]/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!inq.read && (
                                <span className="w-2 h-2 rounded-full bg-[#C2A75C]" />
                              )}
                              <span className="text-[#EAEAEA] text-sm font-medium">
                                {inq.name}
                              </span>
                              <span className="text-[#B0B0B0]/60 text-[10px]">
                                {new Date(
                                  inq.createdAt
                                ).toLocaleDateString("en-NG", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-[#B0B0B0] text-xs mb-1">
                              {inq.email}
                              {inq.phone && ` • ${inq.phone}`}
                            </p>
                            {inq.property && (
                              <p className="text-[#C2A75C] text-xs mb-2">
                                Re: {inq.property.title}
                              </p>
                            )}
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">
                              {inq.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() =>
                                handleMarkRead(inq.id, !inq.read)
                              }
                              className={`p-1.5 rounded-sm transition-colors ${
                                inq.read
                                  ? "text-[#B0B0B0] hover:text-[#C2A75C]"
                                  : "text-[#C2A75C] bg-[#C2A75C]/15"
                              }`}
                              title={
                                inq.read
                                  ? "Mark as unread"
                                  : "Mark as read"
                              }
                            >
                              {inq.read ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <a
                              href={`mailto:${inq.email}`}
                              className="p-1.5 rounded-sm text-[#B0B0B0] hover:text-[#C2A75C] transition-colors"
                              title="Reply via email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-sm text-[#B0B0B0] hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SETTINGS ──────────────────────────────────── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Settings
                </h1>

                {/* User Info */}
                {authUser && (
                  <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm p-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C2A75C]/15 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#C2A75C]" />
                      </div>
                      <div>
                        <p className="text-[#EAEAEA] text-sm font-medium">{authUser.displayName}</p>
                        <p className="text-[#B0B0B0] text-xs">@{authUser.username}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Change Password */}
                <div className="bg-[#1A1A1A] border border-[#C2A75C]/10 rounded-sm">
                  <div className="p-5 border-b border-[#C2A75C]/10">
                    <h3 className="text-[#EAEAEA] font-semibold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#C2A75C]" />
                      Change Password
                    </h3>
                  </div>
                  <ChangePasswordForm />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Property Form Modal ──────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/80 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1A1A1A] border border-[#C2A75C]/20 rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form header */}
              <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#C2A75C]/10 p-5 flex items-center justify-between z-10">
                <h2
                  className="text-lg font-semibold text-[#EAEAEA]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {editingId ? "Edit Property" : "Add New Property"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="text-[#B0B0B0] hover:text-[#EAEAEA] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <div className="p-5 space-y-5">
                {/* Row: Title + Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="e.g. Villa Serena"
                    />
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors rounded-sm appearance-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm resize-none"
                    placeholder="Describe the property..."
                  />
                </div>

                {/* Row: Price + Tag + Status */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="85000000"
                    />
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Tag
                    </label>
                    <select
                      value={form.tag}
                      onChange={(e) =>
                        setForm({ ...form, tag: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors rounded-sm appearance-none"
                    >
                      {propertyTags.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors rounded-sm appearance-none"
                    >
                      {propertyStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row: Location + City */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="GRA, Enugu"
                    />
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="Enugu"
                    />
                  </div>
                </div>

                {/* Row: Beds + Baths + Size */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={form.beds || ""}
                      onChange={(e) =>
                        setForm({ ...form, beds: Number(e.target.value) })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={form.baths || ""}
                      onChange={(e) =>
                        setForm({ ...form, baths: Number(e.target.value) })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                      Size
                    </label>
                    <input
                      type="text"
                      value={form.size}
                      onChange={(e) =>
                        setForm({ ...form, size: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2.5 text-sm outline-none transition-colors rounded-sm"
                      placeholder="450 sqm"
                    />
                  </div>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                    Main Image
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setMainDragOver(true); }}
                    onDragLeave={() => setMainDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setMainDragOver(false); if (e.dataTransfer.files.length) handleMainImageUpload(e.dataTransfer.files); }}
                    onClick={() => document.getElementById("main-image-input")?.click()}
                    className={`relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all duration-300 ${
                      mainDragOver
                        ? "border-[#C2A75C] bg-[#C2A75C]/10"
                        : "border-[#C2A75C]/20 hover:border-[#C2A75C]/40 bg-[#0D0D0D]/40"
                    }`}
                  >
                    <input
                      id="main-image-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => e.target.files && handleMainImageUpload(e.target.files)}
                    />
                    {uploadingMain ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#C2A75C] animate-spin" />
                        <span className="text-[#B0B0B0] text-xs">Uploading...</span>
                      </div>
                    ) : form.image ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-full max-w-[200px] h-32 rounded-sm overflow-hidden border border-[#C2A75C]/20">
                          <Image
                            src={form.image}
                            alt="Main image preview"
                            fill
                            className="object-cover"
                            quality={60}
                          />
                        </div>
                        <span className="text-[#C2A75C] text-xs">{form.image}</span>
                        <span className="text-[#B0B0B0]/60 text-[10px]">Click or drag to replace</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-[#C2A75C]/50" />
                        <span className="text-[#B0B0B0] text-sm">Click or drag to upload main image</span>
                        <span className="text-[#B0B0B0]/50 text-[10px]">JPEG, PNG, WebP, GIF (max 10MB)</span>
                      </div>
                    )}
                  </div>
                  {/* Manual URL input fallback */}
                  <div className="mt-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2 text-xs outline-none transition-colors rounded-sm"
                      placeholder="Or paste image URL manually..."
                    />
                  </div>
                </div>

                {/* Additional Images / Gallery */}
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                    Gallery Images
                  </label>
                  {/* Upload zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setGalleryDragOver(true); }}
                    onDragLeave={() => setGalleryDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setGalleryDragOver(false); if (e.dataTransfer.files.length) handleGalleryUpload(e.dataTransfer.files); }}
                    onClick={() => document.getElementById("gallery-images-input")?.click()}
                    className={`relative border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-all duration-300 mb-3 ${
                      galleryDragOver
                        ? "border-[#C2A75C] bg-[#C2A75C]/10"
                        : "border-[#C2A75C]/20 hover:border-[#C2A75C]/40 bg-[#0D0D0D]/40"
                    }`}
                  >
                    <input
                      id="gallery-images-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
                    />
                    {uploadingGallery ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-[#C2A75C] animate-spin" />
                        <span className="text-[#B0B0B0] text-xs">Uploading images...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="w-6 h-6 text-[#C2A75C]/50" />
                        <span className="text-[#B0B0B0] text-xs">Click or drag to upload gallery images</span>
                        <span className="text-[#B0B0B0]/50 text-[10px]">Select multiple files</span>
                      </div>
                    )}
                  </div>
                  {/* Gallery preview grid */}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-[#C2A75C]/20">
                          <Image
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            fill
                            className="object-cover"
                            quality={50}
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Manual URL add fallback */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2 text-xs outline-none transition-colors rounded-sm"
                      placeholder="Or paste image URL and press +"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-3 py-2 bg-[#252525] text-[#C2A75C] hover:bg-[#C2A75C]/15 border border-[#C2A75C]/20 rounded-sm transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-[#B0B0B0] text-xs tracking-wider uppercase mb-1.5 block">
                    Features
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="flex-1 bg-[#0D0D0D] border border-[#C2A75C]/15 focus:border-[#C2A75C]/40 text-[#EAEAEA] placeholder:text-[#B0B0B0]/40 px-3 py-2 text-sm outline-none transition-colors rounded-sm"
                      placeholder="e.g. Swimming Pool"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 py-2 bg-[#252525] text-[#C2A75C] hover:bg-[#C2A75C]/15 border border-[#C2A75C]/20 rounded-sm transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-[#C2A75C]/10 border border-[#C2A75C]/20 text-[#C2A75C] text-xs px-2 py-1 rounded-sm"
                      >
                        {feat}
                        <button
                          onClick={() => removeFeature(idx)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="accent-[#C2A75C]"
                  />
                  <span className="text-[#EAEAEA] text-sm">
                    Featured Property
                  </span>
                </label>
              </div>

              {/* Form footer */}
              <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-[#C2A75C]/10 p-5 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="border-[#C2A75C]/20 text-[#B0B0B0] hover:text-[#EAEAEA] hover:bg-[#252525] px-6 py-2.5 rounded-none text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#C2A75C] text-[#0D0D0D] hover:bg-[#D4BC7A] px-6 py-2.5 rounded-none font-semibold tracking-wider text-xs uppercase"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {editingId ? "Update Property" : "Create Property"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
