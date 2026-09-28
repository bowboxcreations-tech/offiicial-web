"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    async function getWishlist() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data, error } = await supabase
        .from("wishlist")
        .select(`products (*)`)
        .eq("user_id", user.id);

      if (data) {
        setItems(data.map((entry: any) => entry.products));
      }
      setLoading(false);
    }
    getWishlist();
  }, []);

  const removeFromWishlist = async (productId: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to manage your wishlist!");
        return;
      }

      setRemovingId(productId);
      await new Promise((r) => setTimeout(r, 300));

      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== productId));
      setRemovingId(null);
    } catch (error: any) {
      alert("Error removing item: " + error.message);
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="80" />
            </filter>
            <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
            </filter>
          </defs>
          <motion.circle
            cx="18%"
            cy="12%"
            r="300"
            fill="#FF007F"
            filter="url(#blur1)"
            animate={{
              cx: ["18%", "23%", "13%", "18%"],
              cy: ["12%", "8%", "16%", "12%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="82%"
            cy="55%"
            r="260"
            fill="#00FFFF"
            filter="url(#blur2)"
            animate={{
              cx: ["82%", "77%", "87%", "82%"],
              cy: ["55%", "60%", "50%", "55%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="48%"
            cy="88%"
            r="210"
            fill="#00FFFF"
            filter="url(#blur2)"
            animate={{
              cx: ["48%", "43%", "53%", "48%"],
              cy: ["88%", "83%", "93%", "88%"],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-2 h-2 rounded-none bg-[#00FFFF]" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FFFF]">
                  Your Collection
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-4xl md:text-5xl font-black tracking-tight text-[#000000]"
              >
                My Saved Items
              </motion.h1>
            </div>

            <AnimatePresence mode="wait">
              {!loading && items.length > 0 && (
                <motion.div
                  key={items.length}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-none border-4 border-black self-start sm:self-auto bg-[#FFFFFF]/50 border-[#FF007F]/30 "
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#00FFFF"
                      stroke="#00FFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.div>
                  <span className="font-black text-sm text-[#00FFFF]">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-12 h-12 rounded-none border-4 border-[#FF007F]/30 border-t-4 border-black-[#00FFFF]"
            />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm text-[#000000]/40 font-medium tracking-wide"
            >
              Loading your favorites...
            </motion.p>
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-32 rounded-none border-4 border-dashed border-[#00FFFF]/30 bg-white "
          >
            <motion.div
              animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
            <h3 className="text-3xl font-black mb-3 text-[#000000]">
              Your wishlist is empty
            </h3>
            <p className="text-[#000000]/40 text-sm mb-10 font-medium">
              Save the pieces you love and find them here later
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="text-white px-12 py-4 rounded-none font-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
                style={{
                  background: "#00FFFF",
                }}
              >
                Start Saving Favourites
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={
                    removingId === product.id
                      ? { opacity: 0, scale: 0.88, y: -12 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.35,
                    delay: removingId ? 0 : i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className="group flex flex-col bg-white  rounded-none overflow-hidden border-4 border-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  {/* Image */}
                  <Link href={`/product/?slug=${product.id}`}>
                    <div className="relative overflow-hidden aspect-square">
                      <motion.img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 bg-[#00FFFF]/10 backdrop-hidden">
                        <span className="bg-white text-[#00FFFF] text-[11px] font-black px-4 py-2 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                          View Details
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
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>

                      {/* Left accent bar */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{
                          background:
                            "#FFF500",
                        }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                      />

                      {/* Heart badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: i * 0.06 + 0.2,
                          type: "spring",
                          stiffness: 260,
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-none flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white "
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="#00FFFF"
                          stroke="#00FFFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </motion.div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5">
                    <Link href={`/product/?slug=${product.id}`}>
                      <h3 className="font-black text-[#000000] text-sm leading-snug mb-2 line-clamp-2 hover:text-[#00FFFF] transition-colors duration-150">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="font-black text-base mb-5 mt-auto text-[#00FFFF]">
                      Rs.{product.price.toLocaleString("en-IN")}
                    </p>

                    {/* Action row */}
                    <div className="flex gap-2">
                      <Link href={`/product/?slug=${product.id}`} className="flex-1">
                        <motion.button
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 rounded-sm font-black text-xs text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-150"
                          style={{
                            background:
                              "#00FFFF",
                          }}
                        >
                          <motion.span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "rgba(255,255,255,0.2)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.2,
                            }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-1">
                            View Item
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
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </motion.button>
                      </Link>

                      <motion.button
                        onClick={() => removeFromWishlist(product.id)}
                        disabled={removingId === product.id}
                        whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        whileTap={{ scale: 0.98 }}
                        className="w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-150 flex-shrink-0 disabled:opacity-40 bg-[#FFFFFF]/50 border-4 border-black border-[#FF007F]/20 text-[#FF007F] hover:text-white"
                      >
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {!loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-14"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-none font-black text-sm border-4 bg-white  transition-all duration-150 text-[#00FFFF] border-[#FF007F]/30"
              >
                Discover More
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
