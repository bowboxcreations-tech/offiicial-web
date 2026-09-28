"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Subcategory options for Jewellery
  const jewelrySubcategories = [
    "Pendant",
    "Earring",
    "Ring",
    "Bracelet",
    "Other Jewelleries",
  ];

useEffect(() => {
    async function getProductAndRelated() {
      setLoading(true);
      setImageLoaded(false);
      
      // We removed the direct 'mainProduct' destructuring here
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single(); 

      // Force TypeScript to accept this is a single object, not an array!
      const mainProduct = data as any;

      if (mainProduct) {
        setProduct(mainProduct);
        // Fetch more related products (increased limit)
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("main_category", mainProduct.main_category)
          .neq("id", mainProduct.id) 
          .limit(12);
          
        if (related) {
          setRelatedProducts(related);
          // Set initial filter to current product's subcategory if it's Jewellery
          if (
            mainProduct.main_category === "Jewellery" &&
            mainProduct.sub_category
          ) {
            setSelectedSubCategory(mainProduct.sub_category);
          }
        }
      }
      setLoading(false);
    }
    getProductAndRelated();
  }, [slug]); // <-- IMPORTANT: Changed [id] to [slug] here!

  useEffect(() => {
    async function checkWishlist() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !product) return;
      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();
      if (data) setIsWishlisted(true);
    }
    checkWishlist();
  }, [product]);

  // --- WHATSAPP BUY NOW ---
  const handleBuyNow = async () => {
    // 1. Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. If logged in, save this action to their history!
    if (user && product) {
      await supabase.from("whatsapp_history").insert([
        {
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
        },
      ]);
    }

    // 3. Open WhatsApp as usual
    const phoneNumber = "916290785398";
    const message = `Hey Bowbox! I'm interested in: ${product.name}\nPrice: ₹${product.price}\nLink: ${window.location.href}`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  // --- ADD TO CART ---
  const addToCart = async () => {
    setCartLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // THE FIX: Redirect instead of alert
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data: existingItem } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();
      if (existingItem) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);
        if (error) throw error;
      }
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2200);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setCartLoading(false);
    }
  };

  // --- TOGGLE WISHLIST ---
  const toggleWishlist = async () => {
    setWishlistLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // THE FIX: Redirect instead of alert
      if (!user) {
        router.push("/auth");
        return;
      }
      if (isWishlisted) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);
        if (error) throw error;
        setIsWishlisted(false);
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert([{ user_id: user.id, product_id: product.id }]);
        if (error) throw error;
        setIsWishlisted(true);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
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
              fill="#00FFFF"
              filter="url(#blur1)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 rounded-none border-4 border-[#FF007F]/30 border-t-4 border-black-[#00FFFF] relative z-10"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-[#000000]/40 font-medium tracking-wide relative z-10"
        >
          Loading your product...
        </motion.p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="text-center py-20">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00FFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
          <h3 className="text-2xl font-black text-[#000000] mb-2">
            Product not found
          </h3>
          <p className="text-[#000000]/40 text-sm mb-6">
            We couldn&apos;t find what you&apos;re looking for
          </p>
          <Link href="/shop">
            <motion.span
              whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-none font-black text-sm text-white"
              style={{
                background: "#00FFFF",
              }}
            >
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Browse Shop
            </motion.span>
          </Link>
        </div>
      </div>
    );

  const gallery =
    product.image_gallery && product.image_gallery.length > 0
      ? product.image_gallery
      : [product.image_url];

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
            cx="15%"
            cy="15%"
            r="300"
            fill="#FF007F"
            filter="url(#blur1)"
            animate={{
              cx: ["15%", "20%", "10%", "15%"],
              cy: ["15%", "10%", "20%", "15%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="85%"
            cy="55%"
            r="250"
            fill="#00FFFF"
            filter="url(#blur2)"
            animate={{
              cx: ["85%", "80%", "90%", "85%"],
              cy: ["55%", "60%", "50%", "55%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="45%"
            cy="85%"
            r="200"
            fill="#00FFFF"
            filter="url(#blur2)"
            animate={{
              cx: ["45%", "40%", "50%", "45%"],
              cy: ["85%", "80%", "90%", "85%"],
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
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/shop">
            <motion.span
              whileHover={{ x: -4, backgroundColor: "#00FFFF", color: "#fff" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-none bg-white  border-4 border-black border-[#00FFFF]/30 text-[#00FFFF] transition-all duration-150 mb-10"
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
              Back to Collection
            </motion.span>
          </Link>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-28">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-10 order-first lg:order-last space-y-5"
          >
            <div className="relative">
              {/* Glow behind image */}
              <motion.div
                className="absolute inset-4 rounded-none hidden pointer-events-none"
                style={{
                  background: "#FFF500",
                }}
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Image */}
              <div
                className="relative rounded-none overflow-hidden aspect-square shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white "
                style={{ border: "4px solid rgba(255,255,255,0.8)" }}
              >
                {!imageLoaded && (
                  <motion.div
                    className="absolute inset-0 z-0 bg-gradient-to-br from-[#FF007F]/20 to-[#00FFFF]/20"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={gallery[activeImage]}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                  />
                </AnimatePresence>
              </div>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute top-6 left-6 px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20"
                style={{
                  background: "#00FFFF",
                }}
              >
                {product.main_category}
              </motion.div>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div
                className="flex gap-3 overflow-x-auto py-2 px-1"
                style={{ scrollbarWidth: "none" }}
              >
                {gallery.map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-20 h-20 shrink-0 rounded-none overflow-hidden border-4 transition-all duration-150 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
                    style={{
                      borderColor:
                        activeImage === idx ? "#00FFFF" : "transparent",
                      opacity: activeImage === idx ? 1 : 0.5,
                    }}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Thumbnail ${idx + 1}`}
                    />
                    {activeImage === idx && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 border-4 border-[#00FFFF] rounded-none"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 order-last lg:order-first"
          >
            {/* Category Label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-none bg-[#00FFFF]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FFFF]">
                {product.main_category}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-[#000000]"
            >
              {product.name}
            </motion.h1>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 }}
              className="inline-flex items-baseline gap-2"
            >
              <span className="text-xs font-black text-[#000000]/30 uppercase tracking-wider">
                Rs.
              </span>
              <span className="text-5xl font-black text-[#000000]">
                {product.price.toLocaleString("en-IN")}
              </span>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="rounded-none p-7 bg-white  border-4 border-black border-black"
            >
              <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.2em] mb-3">
                About this piece
              </p>
              <p className="text-base text-[#000000]/70 leading-relaxed whitespace-pre-wrap">
                {product.description ||
                  "Every BOWBOX piece is crafted with love and care. This item is perfect for your special occasion."}
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                product.main_category,
                product.occasion,
                "anti-tarnish",
                "Gift Ready",
              ]
                .filter(Boolean)
                .map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="text-[11px] font-black px-4 py-2 rounded-none border-4 border-black uppercase tracking-wide bg-[#FFFFFF]/50 text-[#00FFFF] border-[#FF007F]/20"
                  >
                    {tag}
                  </motion.span>
                ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4 pt-2"
            >
              {/* Buy Now */}
              <motion.button
                onClick={handleBuyNow}
                whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 rounded-none font-black text-white text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-150"
                style={{
                  background: "#00FFFF",
                }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "rgba(255,255,255,0.2)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Get more details & check availability on WhatsApp
                </span>
              </motion.button>

              {/* Add to Cart + Wishlist */}
              <div className="flex gap-3">
                <motion.button
                  onClick={addToCart}
                  disabled={cartLoading}
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 rounded-none font-black text-sm text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden disabled:opacity-60 transition-all duration-150"
                  style={{
                    background: cartSuccess
                      ? "#FF007F"
                      : "#FFF500",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cartSuccess ? "done" : cartLoading ? "load" : "idle"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center gap-2"
                    >
                      {cartLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.75,
                              ease: "linear",
                            }}
                            className="block w-4 h-4 border-4 border-white border-t-4 border-black-transparent rounded-none"
                          />
                          Adding...
                        </>
                      ) : cartSuccess ? (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Added to Cart
                        </>
                      ) : (
                        <>
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
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  className="py-4 px-6 rounded-none font-black text-sm border-4 transition-all duration-150 disabled:opacity-60"
                  style={{
                    background: isWishlisted
                      ? "#00FFFF"
                      : "white",
                    color: isWishlisted ? "white" : "#00FFFF",
                    borderColor: isWishlisted ? "transparent" : "#FF007F",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isWishlisted ? "saved" : "save"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5"
                    >
                      {wishlistLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            ease: "linear",
                          }}
                          className="block w-4 h-4 border-4 border-current border-t-4 border-black-transparent rounded-none"
                        />
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isWishlisted ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )}
                      {isWishlisted ? "Saved" : "Save"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pt-16"
          >
            <div className="flex items-baseline gap-4 mb-10">
              <div className="w-2 h-2 rounded-none bg-[#00FFFF]" />
              <h2 className="text-3xl font-black text-[#000000]">
                More from{" "}
                <span className="text-[#00FFFF]">{product.main_category}</span>
              </h2>
            </div>

            {/* Subcategory Filter - Only show for Jewellery */}
            {product.main_category === "Jewellery" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <motion.button
                  onClick={() => setSelectedSubCategory(null)}
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-none font-black text-xs uppercase tracking-wider transition-all duration-150 border-4"
                  style={{
                    background:
                      selectedSubCategory === null
                        ? "#00FFFF"
                        : "white",
                    color: selectedSubCategory === null ? "white" : "#00FFFF",
                    borderColor:
                      selectedSubCategory === null ? "transparent" : "#FF007F",
                  }}
                >
                  All Jewellery
                </motion.button>
                {jewelrySubcategories.map((subcat) => (
                  <motion.button
                    key={subcat}
                    onClick={() => setSelectedSubCategory(subcat)}
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-none font-black text-xs uppercase tracking-wider transition-all duration-150 border-4"
                    style={{
                      background:
                        selectedSubCategory === subcat
                          ? "#00FFFF"
                          : "white",
                      color:
                        selectedSubCategory === subcat ? "white" : "#00FFFF",
                      borderColor:
                        selectedSubCategory === subcat
                          ? "transparent"
                          : "#FF007F",
                    }}
                  >
                    {subcat}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Filtered Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts
                .filter((item) =>
                  selectedSubCategory === null ||
                  selectedSubCategory === undefined
                    ? true
                    : item.sub_category === selectedSubCategory,
                )
                .map((item, i) => (
                  <Link key={item.id} href={`/product/?slug=${item.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      className="bg-white  rounded-none overflow-hidden border-4 border-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                    >
                      <div className="relative overflow-hidden aspect-square">
                        <motion.img
                          src={item.image_url}
                          className="w-full h-full object-cover transition-transform duration-200"
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          alt={item.name}
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center bg-[#00FFFF]/10 backdrop-hidden">
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                            className="bg-white text-[#00FFFF] text-[10px] font-black px-4 py-2 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
                          >
                            View
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
                      </div>
                      <div className="p-5">
                        <h4 className="font-black text-sm text-[#000000] truncate mb-1.5">
                          {item.name}
                        </h4>
                        <p className="font-black text-sm text-[#00FFFF]">
                          Rs.{item.price}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

// ── Static-export compatible wrapper (query-param route, no dynamic segment) ──
export default function ProductDetail() {
  return (
    <Suspense fallback={null}>
      <ProductDetailContent />
    </Suspense>
  );
}
