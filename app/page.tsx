"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { supabase } from "../utils/supabase";
import Link from "next/link";
import { TOKENS } from "@/components/Tokens";
import { ToastContainer, nextToastId } from "@/components/Toast";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ProductCardSection } from "@/components/ProductCardSection";

// ── Types ───────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isJewelleryOpen, setIsJewelleryOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [wishedIds, setWishedIds] = useState<Set<number>>(new Set());

  // 1. ADDED: User state for the Navbar
  const [user, setUser] = useState<any>(null);

  // Policy Modal State
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // 2. ADDED: Check login status
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // ── Toast helpers ────────────────────────────────────────────────────────
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextToastId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3700,
    );
  }, []);

  // ── Data fetch ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*");
      if (productData) {
        setNewArrivals(productData.filter((p) => p.is_new_arrival === true));
        setSpecials(productData.filter((p) => p.is_special === true));
        setBestSellers(productData.filter((p) => p.is_best_seller === true));
      }
      if (productError)
        console.error(
          "Product Error:",
          productError.message,
          productError.details,
        );

      const { data: testimonialData, error: testimonialError } = await supabase
        .from("testimonials")
        .select("*");
      if (testimonialData) setTestimonials(testimonialData);
      if (testimonialError)
        console.error(
          "Testimonial Error:",
          testimonialError.message,
          testimonialError.details,
        );

      setIsMounted(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleBuyNow = (
    productName: string,
    productPrice: number,
    imageUrl: string,
  ) => {
    const phoneNumber = "916290785398";
    const message = `Hey Bowbox! I want to know more about this item: ${productName}\nPrice: ₹${productPrice}\nImage Link: ${imageUrl}`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const toggleWishlist = async (productId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      showToast("Please log in to save items to your wishlist", "warning");
      return;
    }
    const { error } = await supabase
      .from("wishlist")
      .insert([{ user_id: user.id, product_id: productId }]);
    if (error) {
      if (error.code === "23505")
        showToast("Already in your wishlist!", "info");
      else showToast("Error saving to wishlist: " + error.message, "error");
    } else {
      setWishedIds((prev) => new Set([...prev, productId]));
      setTimeout(
        () =>
          setWishedIds((prev) => {
            const n = new Set(prev);
            n.delete(productId);
            return n;
          }),
        2000,
      );
      showToast("Saved to wishlist!", "success");
    }
  };

  const addToCart = async (productId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      showToast("Please log in to add items to your cart", "warning");
      return;
    }
    const { error } = await supabase
      .from("cart")
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);
    if (error) {
      showToast("Error adding to cart: " + error.message, "error");
    } else {
      setAddedIds((prev) => new Set([...prev, productId]));
      setTimeout(
        () =>
          setAddedIds((prev) => {
            const n = new Set(prev);
            n.delete(productId);
            return n;
          }),
        2000,
      );
      showToast("Added to cart!", "success");
    }
  };

  // ── Variants ───────────────────────────────────────────────────────────────
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardHover: Variants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  // ── Product card renderer (extracted to components/ProductCardSection.tsx) ──
  const renderProductCards = (products: any[], keyPrefix = "") => (
    <ProductCardSection
      products={products}
      keyPrefix={keyPrefix}
      isDarkMode={isDarkMode}
      addedIds={addedIds}
      wishedIds={wishedIds}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      handleBuyNow={handleBuyNow}
    />
  );
  // ── Static data ────────────────────────────────────────────────────────────
  const sections = [
    {
      title: "New Arrivals",
      data: newArrivals,
      accent: TOKENS.peach,
      bg: TOKENS.peachLight,
    },
    {
      title: "Specials",
      data: specials,
      accent: TOKENS.rose,
      bg: TOKENS.roseLight,
    },
    {
      title: "Best Sellers",
      data: bestSellers,
      accent: TOKENS.pink,
      bg: TOKENS.pinkLight,
    },
  ];

  // ── SVG Icons ──────────────────────────────────────────────────────────────
  const icons = {
    sun: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    moon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
    user: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    heart: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    cart: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
    arrowRight: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    chevronDown: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    gift: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
      </svg>
    ),
    star: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={TOKENS.peach}
        stroke={TOKENS.peach}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    sparkle: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={TOKENS.pink}
        stroke={TOKENS.pink}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
      </svg>
    ),
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen transition-colors duration-500 overflow-x-hidden relative"
      style={{
        background: isDarkMode
          ? "linear-gradient(145deg, #241C33 0%, #2d1b2e 60%, #1E1830 100%)"
          : "linear-gradient(145deg, #FFF9F0 0%, #FFF5F5 50%, #FFF0F8 100%)",
      }}
    >
      {/* Ambient background effects */}
      <FloatingParticles isDarkMode={isDarkMode} />

      {/* Large ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            background: TOKENS.peach,
            width: 500,
            height: 500,
            right: "-10%",
            top: "-5%",
            opacity: isDarkMode ? 0.04 : 0.08,
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            background: TOKENS.pink,
            width: 400,
            height: 400,
            left: "-5%",
            top: "40%",
            opacity: isDarkMode ? 0.03 : 0.06,
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            background: TOKENS.cream,
            width: 350,
            height: 350,
            right: "20%",
            bottom: "10%",
            opacity: isDarkMode ? 0.03 : 0.07,
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Toast portal */}
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* ── TOP BAR ── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-50 flex justify-between items-center px-6 py-3 backdrop-blur-xl border-b"
        style={{
          background: isDarkMode
            ? "rgba(46,36,64,0.7)"
            : "rgba(255,255,255,0.7)",
          borderColor: isDarkMode
            ? "rgba(173,216,230,0.1)"
            : "rgba(253,188,180,0.2)",
        }}
      >
        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 120, damping: 20 } }}
          whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border-[3px]"
          style={{
            background: isDarkMode
              ? "rgba(173,216,230,0.15)"
              : "rgba(230,230,250,0.3)",
            color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
            borderColor: isDarkMode
              ? "rgba(173,216,230,0.2)"
              : "rgba(230,230,250,0.5)",
          }}
        >
          {isDarkMode ? icons.sun : icons.moon}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {[
            // 3. ADDED: Dynamic Login / Profile switch!
            {
              label: user ? "My Profile" : "Login",
              href: user ? "/profile" : "/auth",
              icon: icons.user,
            },
            { label: "Wishlist", href: "/wishlist", icon: icons.heart },
            { label: "Cart", href: "/cart", icon: icons.cart },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <motion.button
                whileHover={{ scale: 1.03, y: -1, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                whileTap={{ scale: 0.94, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border-[3px]"
                style={{
                  background: isDarkMode
                    ? "rgba(173,216,230,0.15)"
                    : "rgba(230,230,250,0.3)",
                  color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
                  borderColor: isDarkMode
                    ? "rgba(173,216,230,0.2)"
                    : "rgba(230,230,250,0.5)",
                }}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </motion.button>
            </Link>
          ))}
          
          {/* Policy Button */}
          <motion.button
            onClick={() => setShowPolicyModal(true)}
            whileHover={{ scale: 1.03, y: -1, transition: { type: "spring", stiffness: 120, damping: 20 } }}
            whileTap={{ scale: 0.94, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border-[3px]"
            style={{
              background: isDarkMode
                ? "rgba(173,216,230,0.15)"
                : "rgba(230,230,250,0.3)",
              color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
              borderColor: isDarkMode
                ? "rgba(173,216,230,0.2)"
                : "rgba(230,230,250,0.5)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="hidden sm:inline">Policy</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── HERO ── */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-10 w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-6 min-h-[320px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[600px] border-b md:aspect-video"
        style={{
          background: isDarkMode
            ? "linear-gradient(145deg, rgba(46,36,64,0.5) 0%, rgba(36,28,51,0.3) 100%)"
            : "linear-gradient(145deg, rgba(255,250,240,0.8) 0%, rgba(255,245,246,0.6) 60%, rgba(255,240,248,0.8) 100%)",
          borderColor: isDarkMode
            ? "rgba(173,216,230,0.1)"
            : "rgba(253,188,180,0.25)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* ── AUTO-SCROLLING BANNERS (Background) ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="flex h-full"
            animate={{
              x: [
                0,
                0,
                "-100%",
                "-100%",
                "-200%",
                "-200%",
                "-300%",
                "-300%",
                "-400%",
                "-400%",
                "-500%",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.15, 0.2, 0.35, 0.4, 0.55, 0.6, 0.75, 0.8, 0.95, 1],
            }}
          >
            {[
              "/banner1.PNG",
              "/banner2.jpg",
              "/banner3.jpg",
              "/banner4.jpg",
              "/banner5.png",
            ].map((banner, i) => (
              <div
                key={i}
                className="w-full h-full flex-shrink-0 flex items-center justify-center relative"
              >
                <img
                  src={banner}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for content readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.25))",
                  }}
                />
              </div>
            ))}
          </motion.div>

          {/* Cloned banners for seamless loop */}
          <motion.div
            className="flex h-full absolute top-0 left-0 w-full"
            animate={{
              x: [
                0,
                0,
                "-100%",
                "-100%",
                "-200%",
                "-200%",
                "-300%",
                "-300%",
                "-400%",
                "-400%",
                "-500%",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.15, 0.2, 0.35, 0.4, 0.55, 0.6, 0.75, 0.8, 0.95, 1],
            }}
            style={{ pointerEvents: "none" }}
          >
            {[
              "/banner1.PNG",
              "/banner2.jpg",
              "/banner3.jpg",
              "/banner4.jpg",
              "/banner5.png",
            ].map((banner, i) => (
              <div
                key={`clone-${i}`}
                className="w-full h-full flex-shrink-0 flex items-center justify-center relative"
              >
                <img
                  src={banner}
                  alt={`Banner ${i + 1} Clone`}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.25))",
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Content on top (z-20) ── */}
        <div className="relative z-20 pointer-events-none flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-10 w-full">
          {/* Decorative floating elements */}
          {isMounted && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 8 + i * 4,
                    height: 8 + i * 4,
                    background: i % 2 === 0 ? TOKENS.peach : TOKENS.rose,
                    left: `${8 + i * 14}%`,
                    top: `${12 + (i % 3) * 22}%`,
                    opacity: 0.2,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    y: [0, -25, 0],
                    x: [0, i % 2 === 0 ? 15 : -15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.35, 0.2],
                  }}
                  transition={{
                    duration: 4 + i * 0.6,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  style={{
                    left: `${(i * 12.5) % 100}%`,
                    top: `${(i * 11.3 + 5) % 100}%`,
                  }}
                  animate={{
                    scale: [1, 0, 1],
                    opacity: [0.3, 0, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill={TOKENS.pink}
                    opacity="0.4"
                  >
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          )}

          {/* Decorative curved lines */}
          <svg
            className="absolute inset-0 z-20 w-full h-full pointer-events-none opacity-[0.03]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,300 Q400,100 800,300 T1600,300"
              fill="none"
              stroke={TOKENS.pink}
              strokeWidth="2"
            />
            <path
              d="M0,400 Q400,200 800,400 T1600,400"
              fill="none"
              stroke={TOKENS.peach}
              strokeWidth="2"
            />
          </svg>

          <motion.div
            initial={{ x: -80, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            whileHover={{ scale: 1.03, rotate: 2 }}
            className="relative z-20"
          >
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.cream}, ${TOKENS.peach})`,
                boxShadow: `0 20px 60px ${TOKENS.peach}40`,
              }}
            >
              <img
                src="/logo-circle.jpg"
                alt="Bowbox Logo"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-52 md:h-52 object-contain rounded-full"
              />
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: TOKENS.pink }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {icons.sparkle}
            </motion.div>
          </motion.div>

          <div className="relative z-20 text-center md:text-left max-w-sm sm:max-w-md pointer-events-auto flex-shrink-0">
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
              className="mb-2"
            >
              <img
                src="/logo-text.png"
                alt="Bowbox Text Logo"
                className="w-56 md:w-72 h-auto object-contain drop-shadow-lg mx-auto md:mx-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 justify-center md:justify-start mb-4"
            >
              <div className="h-px w-8" style={{ background: TOKENS.peach }} />
              <p
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TOKENS.pink }}
              >
                Handcrafted with love
              </p>
              <div className="h-px w-8" style={{ background: TOKENS.peach }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-sm mb-6 leading-relaxed"
              style={{ color: TOKENS.textMid }}
            >
              Curated gifts for every moment. From birthdays to anniversaries,
              find the perfect expression of your feelings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                  whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                  className="px-10 py-4 rounded-full font-bold text-sm shadow-2xl relative overflow-hidden flex items-center gap-2 mx-auto md:mx-0"
                  style={{
                    background: `linear-gradient(135deg, ${TOKENS.peach}, ${TOKENS.pink})`,
                    color: TOKENS.white,
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)", border: "3px solid #F3C4BB",
                  }}
                >
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10">Shop Collection</span>
                  <span className="relative z-10">{icons.arrowRight}</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-40 flex justify-center gap-3 px-6 py-4 backdrop-blur-xl border-b"
        style={{
          background: isDarkMode
            ? "rgba(46,36,64,0.6)"
            : "rgba(255,255,255,0.6)",
          borderColor: isDarkMode
            ? "rgba(173,216,230,0.08)"
            : "rgba(253,188,180,0.15)",
        }}
      >
        {[
          { label: "Home", href: "/" },
          { label: "Shop All", href: "/shop" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.button
              whileHover={{ scale: 1.03, y: -1, transition: { type: "spring", stiffness: 120, damping: 20 } }}
              whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
              className="font-bold text-sm px-7 py-2.5 rounded-full text-white relative overflow-hidden border-[3px] border-[#F3C4BB]"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.peach}, ${TOKENS.pink})`,
                boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {item.label}
            </motion.button>
          </Link>
        ))}

        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.03, y: -1, transition: { type: "spring", stiffness: 120, damping: 20 } }}
            whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
            className="font-bold text-sm px-7 py-2.5 rounded-full border-[3px] flex items-center gap-2 transition-all"
            style={{
              color: TOKENS.pink,
              borderColor: `${TOKENS.pink}30`,
              background: isDarkMode
                ? "rgba(173,216,230,0.1)"
                : TOKENS.pinkLight,
            }}
          >
            Categories
            <motion.span
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {icons.chevronDown}
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onMouseLeave={() => setOpenSubmenu(null)}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 shadow-2xl rounded-2xl overflow-visible border z-50 backdrop-blur-xl"
                style={{
                  background: isDarkMode ? TOKENS.glassDark : TOKENS.glass,
                  borderColor: isDarkMode
                    ? "rgba(173,216,230,0.15)"
                    : "rgba(253,188,180,0.25)",
                  boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {[
                  {
                    label: "Jewellery",
                    href: "/shop?category=Jewellery",
                    icon: "ring",
                    submenu: [
                      {
                        label: "Pendant",
                        href: "/shop?category=Jewellery&sub=Pendant",
                      },
                      {
                        label: "Earring",
                        href: "/shop?category=Jewellery&sub=Earring",
                      },
                      {
                        label: "Ring",
                        href: "/shop?category=Jewellery&sub=Ring",
                      },
                      {
                        label: "Bracelet",
                        href: "/shop?category=Jewellery&sub=Bracelet",
                      },
                      {
                        label: "Other Jewelleries",
                        href: "/shop?category=Jewellery&sub=Other%20Jewelleries",
                      },
                    ],
                  },
                  {
                    label: "Boxes",
                    href: "/shop?category=Boxes",
                    icon: "gift",
                  },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="w-full relative overflow-visible"
                  >
                    {item.submenu ? (
                      <>
                        {/* Jewellery Parent Button */}
                        <div className="overflow-hidden">
                          <motion.button
                            onClick={() => {
                              setIsJewelleryOpen(!isJewelleryOpen);
                            }}
                            onMouseEnter={(e) => {
                              setOpenSubmenu(item.label);
                              e.currentTarget.style.background = `linear-gradient(90deg, ${TOKENS.peach}, ${TOKENS.pink})`;
                              e.currentTarget.style.color = TOKENS.white;
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="w-full px-4 py-3.5 text-left text-sm font-bold transition-all border-b flex items-center justify-between md:hover:bg-gradient-to-r"
                            style={{
                              color: TOKENS.pink,
                              borderColor: isDarkMode
                                ? "rgba(173,216,230,0.08)"
                                : "rgba(253,188,180,0.15)",
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = TOKENS.pink;
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>{item.label}</span>
                            <motion.svg
                              animate={{ rotate: isJewelleryOpen ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="md:hidden"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </motion.svg>
                            {/* Desktop arrow always visible, pointing right */}
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="hidden md:block"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </motion.button>
                        </div>

                        {/* Mobile Accordion - Vertical Layout */}
                        <AnimatePresence>
                          {isJewelleryOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="md:hidden overflow-hidden"
                            >
                              <div className="overflow-hidden">
                                {item.submenu.map((subitem, subIdx) => (
                                  <Link
                                    key={subitem.href}
                                    href={subitem.href}
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setIsJewelleryOpen(false);
                                    }}
                                  >
                                    <motion.button
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIdx * 0.03 }}
                                      className="w-full px-4 py-3 text-left text-sm font-bold transition-all border-b last:border-0 flex items-center gap-3 pl-8"
                                      style={{
                                        color: TOKENS.pink,
                                        borderColor: isDarkMode
                                          ? "rgba(173,216,230,0.08)"
                                          : "rgba(253,188,180,0.15)",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(90deg, ${TOKENS.peach}, ${TOKENS.pink})`;
                                        e.currentTarget.style.color =
                                          TOKENS.white;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                          "transparent";
                                        e.currentTarget.style.color =
                                          TOKENS.pink;
                                      }}
                                    >
                                      <span className="text-xs opacity-60">
                                        →
                                      </span>
                                      <span style={{ opacity: 0.8 }}>
                                        {subitem.label}
                                      </span>
                                    </motion.button>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Desktop Popup - Horizontal Layout */}
                        <AnimatePresence>
                          {openSubmenu === item.label && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              onMouseEnter={() => setOpenSubmenu(item.label)}
                              onMouseLeave={() => setOpenSubmenu(null)}
                              className="hidden md:block absolute left-full top-0 ml-2 min-w-48 rounded-xl overflow-visible border shadow-lg z-50 backdrop-blur-xl"
                              style={{
                                background: isDarkMode
                                  ? TOKENS.glassDark
                                  : TOKENS.glass,
                                borderColor: isDarkMode
                                  ? "rgba(173,216,230,0.15)"
                                  : "rgba(253,188,180,0.25)",
                                boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
                              }}
                            >
                              <div className="overflow-hidden rounded-xl">
                                {item.submenu.map((subitem, subIdx) => (
                                  <Link
                                    key={subitem.href}
                                    href={subitem.href}
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setOpenSubmenu(null);
                                    }}
                                  >
                                    <motion.button
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIdx * 0.03 }}
                                      className="w-full px-4 py-3 text-left text-sm font-bold transition-all border-b last:border-0 flex items-center gap-3 pl-6"
                                      style={{
                                        color: TOKENS.pink,
                                        borderColor: isDarkMode
                                          ? "rgba(173,216,230,0.08)"
                                          : "rgba(253,188,180,0.15)",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(90deg, ${TOKENS.peach}, ${TOKENS.pink})`;
                                        e.currentTarget.style.color =
                                          TOKENS.white;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                          "transparent";
                                        e.currentTarget.style.color =
                                          TOKENS.pink;
                                      }}
                                    >
                                      <span className="text-xs opacity-60">
                                        →
                                      </span>
                                      <span style={{ opacity: 0.8 }}>
                                        {subitem.label}
                                      </span>
                                    </motion.button>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="overflow-hidden">
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="w-full px-4 py-3.5 text-left text-sm font-bold transition-all border-b last:border-0 flex items-center gap-3"
                            style={{
                              color: TOKENS.pink,
                              borderColor: isDarkMode
                                ? "rgba(173,216,230,0.08)"
                                : "rgba(253,188,180,0.15)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `linear-gradient(90deg, ${TOKENS.peach}, ${TOKENS.pink})`;
                              e.currentTarget.style.color = TOKENS.white;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = TOKENS.pink;
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>{item.label}</span>
                          </motion.button>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ── PRODUCT SECTIONS ── */}
      <div className="relative z-10 py-6 space-y-12 px-4 md:px-8">
        {sections.map(({ title, data, accent, bg }) => (
          <motion.section
            key={title}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-1.5 h-8 rounded-full"
                style={{ background: accent }}
              />
              <h2
                className="text-2xl md:text-3xl font-black tracking-tight"
                style={{
                  color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
                }}
              >
                {title}
              </h2>
              <div
                className="flex-1 h-px ml-3"
                style={{ background: `${accent}25` }}
              />
              <Link href="/shop">
                <motion.span
                  whileHover={{ x: 4 }}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  style={{ color: accent }}
                >
                  See all
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.span>
              </Link>
            </div>

            <div
              className="rounded-3xl p-6 border overflow-x-auto overflow-y-hidden scrollbar-hide"
              style={{
                background: isDarkMode ? "rgba(46,36,64,0.4)" : bg,
                borderWidth: "3px",
                borderColor: isDarkMode
                  ? "rgba(173,216,230,0.2)"
                  : "#F3C4BB",
                boxShadow: isDarkMode
                  ? "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 8px rgba(0,0,0,0.2)"
                  : "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05), inset 2px 2px 6px rgba(255,255,255,0.7)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex gap-5 px-2">{renderProductCards(data)}</div>
            </div>
          </motion.section>
        ))}
        {/* Testimonials */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-1.5 h-8 rounded-full"
              style={{ background: TOKENS.cream }}
            />
            <h2
              className="text-2xl md:text-3xl font-black tracking-tight"
              style={{
                color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
              }}
            >
              What Customers Say
            </h2>
            <div
              className="flex-1 h-px ml-3"
              style={{ background: `${TOKENS.cream}40` }}
            />
          </div>

          <div
            className="rounded-3xl p-6 border overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{
              background: isDarkMode ? "rgba(46,36,64,0.4)" : TOKENS.creamLight,
              borderWidth: "3px",
              borderColor: isDarkMode
                ? "rgba(173,216,230,0.2)"
                : "#F3C4BB",
              boxShadow: isDarkMode
                ? "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 8px rgba(0,0,0,0.2)"
                : "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05), inset 2px 2px 6px rgba(255,255,255,0.7)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-5 px-2">
              {testimonials.length === 0 ? (
                <div className="w-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{
                        background: isDarkMode
                          ? "rgba(173,216,230,0.1)"
                          : TOKENS.peachLight,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={TOKENS.peach}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                    </div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: TOKENS.textLight }}
                    >
                      No reviews yet...
                    </p>
                  </div>
                </div>
              ) : (
                testimonials.map((t) => (
                  <motion.div
                    key={t.id}
                    className="h-64 w-auto rounded-2xl shadow-lg border-2 flex-shrink-0 overflow-hidden relative group"
                    style={{
                      borderColor: isDarkMode
                        ? "rgba(173,216,230,0.15)"
                        : TOKENS.white,
                      boxShadow: isDarkMode
                        ? "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 8px rgba(0,0,0,0.2)"
                        : "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
                    }}
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={t.image_url}
                      alt="Review"
                      className="h-full w-auto object-cover"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(173,216,230,0.3), transparent)",
                      }}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-16 py-10 text-center border-t"
        style={{
          background: `linear-gradient(135deg, ${TOKENS.peach}, ${TOKENS.pink})`,
          borderColor: `${TOKENS.peach}30`,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          {icons.gift}
          <p className="text-white/90 text-xs font-bold uppercase tracking-[0.2em]">
            Handcrafted with care
          </p>
        </div>
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 BOWBOX — All rights reserved
        </p>
      </motion.footer>

      {/* Floating gift button */}
      <motion.div
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center z-50 cursor-pointer backdrop-blur-md border-[3px]"
        style={{
          background: `linear-gradient(135deg, ${TOKENS.peach}, ${TOKENS.pink})`,
          borderColor: "rgba(255,255,255,0.3)",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
        }}
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
          boxShadow: [
            "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
            "6px 10px 16px rgba(0,0,0,0.12), inset -2px -2px 8px rgba(0,0,0,0.05)",
            "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
      >
        {icons.gift}
      </motion.div>

      {/* ── POLICY MODAL ── */}
      <AnimatePresence>
        {showPolicyModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPolicyModal(false)}
          >
            <motion.div
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-8 border-4 border-[#F3C4BB]"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(46,36,64,0.95) 0%, rgba(36,28,51,0.95) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,242,252,0.98) 100%)",
                boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowPolicyModal(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isDarkMode
                    ? "rgba(173,216,230,0.2)"
                    : "rgba(230,230,250,0.3)",
                  color: isDarkMode ? TOKENS.cream : TOKENS.textDark,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>

              {/* Policy Content */}
              <div className="space-y-6 pr-4">
                <h2 className="text-3xl font-black mb-6" style={{ color: TOKENS.pink }}>
                  Policy
                </h2>

                <div className="space-y-4 text-sm leading-relaxed" style={{ color: isDarkMode ? TOKENS.cream : TOKENS.textDark }}>
                  <div>
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: TOKENS.peach }}>
                      <span>A.</span> How to Order
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1 ml-2">
                      <li>Select product</li>
                      <li>DM us your selections</li>
                      <li>We'll confirm availability, price & shipping charges</li>
                      <li>Make payment via UPI (details will be shared)</li>
                      <li>We pack your order with love & ship it soon!</li>
                      <li>Tracking details will be shared after dispatch</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: TOKENS.peach }}>
                      <span>B.</span> Payment Policy
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 ml-2">
                      <li>Prepaid orders only (No COD)</li>
                      <li>Payments via UPI or bank transfer</li>
                      <li>Orders are confirmed only after full payment</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: TOKENS.peach }}>
                      <span>C.</span> Shipping & Delivery
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 ml-2">
                      <li>We ship PAN Kolkata</li>
                      <li>Orders dispatched within 1-3 working days</li>
                      <li>Delivery in 7-14 working days (location dependent)</li>
                      <li>Shipping charges apply - shared at order time</li>
                      <li>FREE SHIPPING on all orders above ₹999</li>
                      <li>Premium packaging and personalised notes available</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: TOKENS.peach }}>
                      <span>D.</span> Return & Exchange Policy
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 ml-2">
                      <li>No returns or exchanges unless:</li>
                      <li className="ml-4">• Wrong product received</li>
                      <li className="ml-4">• Product is damaged</li>
                      <li>For valid claims, a clear unboxing video within 24 hours is a must</li>
                      <li>Note: No returns accepted without video proof</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
