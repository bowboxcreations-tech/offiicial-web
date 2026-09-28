"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category");
  const subFilter = searchParams.get("sub");
  const occasionFilter = searchParams.get("occasion");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select("*");
      
      // 1. Filter by Main Category (e.g., Jewellery)
      if (categoryFilter) {
        query = query.eq("main_category", categoryFilter);
      }
      
      // 2. Filter by Sub-Category (e.g., Ring, Pendant)
      if (subFilter) {
        query = query.eq("sub_category", subFilter);
      }
      
      // 3. Filter by Occasion (kept just in case you still have older products)
      if (occasionFilter) {
        query = query.eq("occasion", occasionFilter);
      }

      // Order items so the newest products show up first!
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (data) setProducts(data);
      if (error) console.error("Error fetching filtered products:", error);
      setLoading(false);
    }
    fetchProducts();
  }, [categoryFilter, subFilter, occasionFilter]); // <-- subFilter is now safely tracked here!

 const handleBuyNow = async (name: string, price: number, imageUrl: string, productId: number) => {
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. If logged in, save this action to their history!
    if (user) {
      await supabase.from("whatsapp_history").insert([{
        user_id: user.id,
        product_id: productId,
        product_name: name,
        price: price
      }]);
    }

    // 3. Open WhatsApp as usual
    const phoneNumber = "916290785398";
    const message = `Hey Bowbox! I want to know more about: ${name}\nPrice: ₹${price}\nLink: ${imageUrl}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const addToCart = async (productId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    const { error } = await supabase
      .from("cart")
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);
    if (error) {
      alert("Error adding to cart.");
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
    }
  };

  const getPageTitle = () => {
    if (categoryFilter) return `${categoryFilter} Collection`;
    if (occasionFilter) return `${occasionFilter} Special Gifts`;
    return "Our Entire Collection";
  };

  const activeFilter = categoryFilter || occasionFilter;

  return (
    <div className="min-h-screen bg-[#E6E6FA] relative overflow-hidden pb-24">
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
            cx="20%"
            cy="15%"
            r="320"
            fill="#FDBCB4"
            filter="url(#blur1)"
            animate={{
              cx: ["20%", "25%", "15%", "20%"],
              cy: ["15%", "10%", "20%", "15%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="85%"
            cy="50%"
            r="260"
            fill="#ADD8E6"
            filter="url(#blur2)"
            animate={{
              cx: ["85%", "80%", "90%", "85%"],
              cy: ["50%", "55%", "45%", "50%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50%"
            cy="85%"
            r="220"
            fill="#ADD8E6"
            filter="url(#blur2)"
            animate={{
              cx: ["50%", "45%", "55%", "50%"],
              cy: ["85%", "80%", "90%", "85%"],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
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
          className="flex flex-col items-center mb-14"
        >
          <Link href="/">
            <motion.span
              whileHover={{ x: -4, backgroundColor: "#ADD8E6", color: "#fff" }}
              whileTap={{ scale: 0.97, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-[#ADD8E6]/30 text-[#ADD8E6] transition-all duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </motion.span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#ADD8E6]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#ADD8E6]">
              Shop
            </span>
            <div className="w-2 h-2 rounded-full bg-[#ADD8E6]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-5xl md:text-6xl font-black text-center tracking-tight mb-3 text-[#3A2E4F]"
          >
            {getPageTitle()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-bold uppercase tracking-[0.25em] mb-5 text-[#ADD8E6]"
          >
            handcrafted with love
          </motion.p>
          <AnimatePresence>
            {activeFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                    whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                    className="flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-full border-2 transition-all duration-300 bg-[#E6E6FA]/50 text-[#ADD8E6] border-[#FDBCB4]/30 hover:bg-[#ADD8E6] hover:text-white hover:border-[#ADD8E6]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#ADD8E6]" />
                    {activeFilter}
                    <span className="text-[#3A2E4F]/30 ml-1 flex items-center gap-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                      Clear
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-xs text-[#3A2E4F]/30 font-bold mt-4 uppercase tracking-[0.2em]"
            >
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              in our shop only for you
            </motion.p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-12 h-12 rounded-full border-[3px] border-[#FDBCB4]/30 border-t-[#ADD8E6]"
            />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm text-[#3A2E4F]/40 font-medium tracking-wide"
            >
              Finding the perfect gifts...
            </motion.p>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-32 rounded-3xl border-4 border-dashed border-[#ADD8E6]/50 bg-white/50 backdrop-blur-xl shadow-[4px_4px_8px_rgba(0,0,0,0.08),inset_-2px_-2px_8px_rgba(0,0,0,0.05)]"
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ADD8E6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2.5 2.5" />
                <path d="M16.5 8a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2.5 2.5" />
              </svg>
            </motion.div>
            <h3 className="text-3xl font-black mb-3 text-[#3A2E4F]">
              No items found
            </h3>
            <p className="text-[#3A2E4F]/40 text-sm mb-10 font-medium">
              Try browsing our full collection instead
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 20px 40px -10px rgba(173,216,230,0.4)",
                }}
                whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                className="text-white px-12 py-4 rounded-full font-black text-sm shadow-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #ADD8E6, #ADD8E6)",
                }}
              >
                View All Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => {
                const gallery =
                  product.image_gallery && product.image_gallery.length > 0
                    ? product.image_gallery
                    : [product.image_url];
                const mainImage = gallery[0];
                const hoverImage = gallery.length > 1 ? gallery[1] : gallery[0];
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{
                      delay: i * 0.055,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -10, scale: 1.03, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                    className="group flex flex-col bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border-4 border-[#F3C4BB] shadow-[4px_4px_8px_rgba(0,0,0,0.08),inset_-2px_-2px_8px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]"
                  >
                   <Link href={`/product/?slug=${product.slug}`}>
  <div className="relative overflow-hidden aspect-square bg-white">
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover absolute inset-0 transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                        />
                        <img
                          src={hoverImage}
                          alt={`${product.name} Alternate View`}
                          className="w-full h-full object-cover absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-[#ADD8E6]/10 backdrop-blur-[2px]">
                          <motion.span
                            initial={{ y: 8, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="bg-white text-[#ADD8E6] text-[11px] font-black px-4 py-2 rounded-full border-[3px] border-[#F3C4BB] shadow-[4px_4px_8px_rgba(0,0,0,0.08),inset_-2px_-2px_8px_rgba(0,0,0,0.05)] flex items-center gap-1"
                          >
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
                          </motion.span>
                        </div>
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 z-20"
                          style={{
                            background:
                              "linear-gradient(180deg, #FDBCB4, #ADD8E6)",
                          }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      <Link href={`/product/?slug=${product.slug}`}>
                        <h3 className="font-black text-[#3A2E4F] text-sm leading-snug line-clamp-2 mb-2 hover:text-[#ADD8E6] transition-colors duration-300">
                          {product.name}
                        </h3>
                      </Link>
                      {product.occasion && (
                        <span className="text-[10px] font-black uppercase tracking-wider mb-3 px-3 py-1 rounded-full self-start bg-[#E6E6FA]/50 text-[#ADD8E6] border border-[#FDBCB4]/20">
                          {product.occasion}
                        </span>
                      )}
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={product.price}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-black text-lg mt-auto mb-4 text-[#ADD8E6]"
                        >
                          {formatPrice(product.price)}
                        </motion.p>
                      </AnimatePresence>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => addToCart(product.id)}
                          whileTap={{ scale: 0.93, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                          className="flex-1 py-3 rounded-2xl font-black text-xs relative overflow-hidden transition-all duration-300"
                          style={{
                            background: addedIds.has(product.id)
                              ? "linear-gradient(135deg, #98FF98, #6EDC6E)"
                              : "rgba(230,230,250,0.5)",
                            color: addedIds.has(product.id)
                              ? "white"
                              : "#ADD8E6",
                            border: `3px solid ${addedIds.has(product.id) ? "transparent" : "#F3C4BB"}`,
                            boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={addedIds.has(product.id) ? "added" : "add"}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.18 }}
                              className="flex items-center justify-center gap-1.5"
                            >
                              {addedIds.has(product.id) ? (
                                <>
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                  Added
                                </>
                              ) : (
                                <>
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
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                  Cart
                                </>
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </motion.button>
                        <motion.button
                          onClick={() =>
                            handleBuyNow(product.name, product.price, mainImage, product.id)
                          }
                          whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                          whileTap={{ scale: 0.93, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                          className="flex-1 py-3 rounded-2xl font-black text-xs text-white relative overflow-hidden transition-all duration-300 border-[3px] border-[#F3C4BB] shadow-[4px_4px_8px_rgba(0,0,0,0.08),inset_-2px_-2px_8px_rgba(0,0,0,0.05)]"
                          style={{
                            background:
                              "linear-gradient(135deg, #ADD8E6, #ADD8E6)",
                          }}
                        >
                          <motion.span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.18) 50%, transparent 62%)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.15,
                            }}
                          />
                          <span className="relative z-10">Buy Now</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E6E6FA] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
          <div className="fixed inset-0 pointer-events-none">
            <svg
              className="absolute w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="80" />
                </filter>
              </defs>
              <motion.circle
                cx="50%"
                cy="50%"
                r="250"
                fill="#ADD8E6"
                filter="url(#blur1)"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-12 h-12 rounded-full border-[3px] border-[#FDBCB4]/30 border-t-[#ADD8E6] relative z-10"
          />
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-sm text-[#3A2E4F]/40 font-medium tracking-wide relative z-10"
          >
            Loading Shop...
          </motion.p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
