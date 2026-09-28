"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { TOKENS } from "./Tokens";

interface ProductCardSectionProps {
  products: any[];
  keyPrefix?: string;
  isDarkMode: boolean;
  addedIds: Set<number>;
  wishedIds: Set<number>;
  addToCart: (productId: number) => void | Promise<void>;
  toggleWishlist: (productId: number) => void | Promise<void>;
  handleBuyNow: (
    productName: string,
    productPrice: number,
    imageUrl: string,
  ) => void;
}

export function ProductCardSection({
  products,
  keyPrefix = "",
  isDarkMode,
  addedIds,
  wishedIds,
  addToCart,
  toggleWishlist,
  handleBuyNow,
}: ProductCardSectionProps) {
  const cardHover: Variants = {
    rest: { y: 0, scale: 1 },
    hover: { x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

    if (products.length === 0) {
      return (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-none flex items-center justify-center"
              style={{ background: TOKENS.peachLight }}
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
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <p
              className="text-sm font-bold"
              style={{ color: TOKENS.textLight }}
            >
              No items uploaded yet...
            </p>
          </div>
        </div>
      );
    }

    return products.map((product, idx) => {
      // NEW: Compute Main Image and Hover Image
      const gallery =
        product.image_gallery && product.image_gallery.length > 0
          ? product.image_gallery
          : [product.image_url];

      const mainImage = gallery[0];
      const hoverImage = gallery.length > 1 ? gallery[1] : gallery[0];

      return (
        <motion.div
          key={`${keyPrefix}${product.id}`}
          className="w-56 shrink-0 flex flex-col rounded-none overflow-hidden group relative"
          style={{
            background: isDarkMode ? "#111111" : TOKENS.white,
            boxShadow: isDarkMode
              ? "6px 6px 0px 0px rgba(0,0,0,1)"
              : "6px 6px 0px 0px rgba(0,0,0,1)",
            border: `4px solid ${isDarkMode ? "#000000" : "#000000"}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.08 }}
          variants={cardHover}
          whileHover="hover"
        >
          <Link href={`/product/?slug=${product.slug}`}>
            <div className="relative overflow-hidden aspect-square bg-white">
              {/* Base Image */}
              <motion.img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Secondary Hover Image */}
              <motion.img
                src={hoverImage}
                alt={`${product.name} alternate view`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-108 transform"
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-center pb-4 z-10"
                style={{
                  background:
                    "rgba(0,255,255,0.15)",
                }}
              >
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="px-4 py-2 rounded-none text-xs font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] "
                  style={{
                    background: TOKENS.glass,
                    color: TOKENS.peach,
                    border: `1px solid ${TOKENS.pink}30`,
                  }}
                >
                  View Details
                </motion.span>
              </div>
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-none z-20"
                style={{
                  background: `${TOKENS.peach}`,
                }}
              />
            </div>
          </Link>

          <div className="p-4 flex flex-col flex-1 relative z-20 bg-white dark:bg-transparent">
            <Link href={`/product/?slug=${product.slug}`}>
              <h3
                className="font-bold text-xs leading-snug line-clamp-2 min-h-[36px] mb-2 transition-colors duration-150"
                style={{ color: isDarkMode ? TOKENS.cream : TOKENS.textDark }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = TOKENS.peach)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isDarkMode
                    ? TOKENS.cream
                    : TOKENS.textDark)
                }
              >
                {product.name}
              </h3>
            </Link>
            <p
              className="font-black text-sm mb-3 mt-auto tracking-wide"
              style={{ color: TOKENS.peach }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="flex gap-2 mb-2">
              <motion.button
                onClick={() => addToCart(product.id)}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-none font-bold text-[10px] transition-all relative overflow-hidden flex items-center justify-center gap-1"
                style={{
                  background: addedIds.has(product.id)
                    ? "#00E676"
                    : TOKENS.creamLight,
                  color: addedIds.has(product.id)
                    ? TOKENS.white
                    : TOKENS.textDark,
                  border: `4px solid ${addedIds.has(product.id) ? "transparent" : "#000000"}`,
                  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={addedIds.has(product.id) ? "y" : "n"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1"
                  >
                    {addedIds.has(product.id) ? "✓ Added" : "+ Add to Cart"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => toggleWishlist(product.id)}
                whileTap={{ scale: 0.98 }}
                className="w-9 h-9 rounded-none flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  background: wishedIds.has(product.id)
                    ? TOKENS.peach
                    : TOKENS.peachLight,
                  border: `4px solid ${wishedIds.has(product.id) ? "#000000" : "#000000"}`,
                  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wishedIds.has(product.id) ? "f" : "e"}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 400, damping: 10,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={wishedIds.has(product.id) ? TOKENS.white : "none"}
                      stroke={
                        wishedIds.has(product.id) ? TOKENS.white : TOKENS.peach
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>

            <motion.button
              onClick={() =>
                handleBuyNow(product.name, product.price, mainImage)
              }
              whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-none font-bold text-[10px] text-white relative overflow-hidden flex items-center justify-center gap-1.5"
              style={{
                background: `${TOKENS.peach}`,
                border: "4px solid #000000",
                boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
              }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "rgba(255,255,255,0.2)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              Buy Now
            </motion.button>
          </div>
        </motion.div>
      );
    });
  }
