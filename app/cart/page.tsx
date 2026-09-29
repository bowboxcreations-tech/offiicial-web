"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    async function getCart() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      const { data } = await supabase
        .from("cart")
        .select(`id, quantity, products (*)`)
        .eq("user_id", user.id);
      if (data) setCartItems(data);
      setLoading(false);
    }
    getCart();
  }, []);

  const removeFromCart = async (cartItemId: number) => {
    setRemovingId(cartItemId);
    await new Promise((r) => setTimeout(r, 320));
    const { error } = await supabase.from("cart").delete().eq("id", cartItemId);
    if (!error)
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    setRemovingId(null);
  };

  const updateQuantity = async (
    cartItemId: number,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      const confirmed = confirm("Remove this item from your cart?");
      if (confirmed) await removeFromCart(cartItemId);
      return;
    }
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQty })
      .eq("id", cartItemId);
    if (!error) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item,
        ),
      );
    }
  };

  const handleCheckout = () => {
    const phoneNumber = "916290785398";
    const itemList = cartItems
      .map(
        (item) =>
          `- ${item.products.name} (Qty: ${item.quantity}) - Rs.${item.products.price}\n  View: ${item.products.image_url}`,
      )
      .join("\n\n");
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.products.price * item.quantity,
      0,
    );
    const message = `Hey Bowbox! I'd like to order:\n\n${itemList}\n\nTotal: Rs.${totalAmount.toFixed(2)}`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fdfdcb] relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        
      </div>


      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-2 h-2 rounded-none bg-[#ec729c]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
                Shopping Cart
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black leading-none">
              Your
              <br />
              <span className="text-black">Cart</span>
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={totalItems}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium mt-4 text-black"
              >
                {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
              </motion.p>
            </AnimatePresence>
          </div>

          <Link href="/shop">
            <motion.span
              whileHover={{ x: -4, backgroundColor: "#ec729c", color: "#fdfdcb" }}
              whileTap={{ scale: 0.98 }}
              className="text-sm font-bold flex items-center gap-2 px-6 py-3 rounded-none border-4 border-black bg-[#fdfdcb]  text-black transition-all duration-75"
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
              Shop More
            </motion.span>
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-12 h-12 rounded-none border-4 border-black border-t-transparent"
            />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-black font-medium tracking-wide"
            >
              Loading your treasures...
            </motion.p>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="text-center py-32 rounded-none border-4 border-solid border-black bg-[#fdfdcb] "
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ec729c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </motion.div>
            <h3 className="text-3xl font-black mb-3 text-black">
              Your cart is empty
            </h3>
            <p className="text-black text-sm mb-10 font-medium">
              Time to find something beautiful
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
                className="text-black px-12 py-4 rounded-none font-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-75"
                style={{
                  background: "#ec729c",
                }}
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-3 space-y-5">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -40, scale: 0.96 }}
                    animate={
                      removingId === item.id
                        ? { opacity: 0, x: 80, scale: 0.9 }
                        : { opacity: 1, x: 0, scale: 1 }
                    }
                    exit={{
                      opacity: 0,
                      height: 0,
                      marginBottom: 0,
                      scale: 0.9,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative bg-[#fdfdcb]  rounded-none border-4 border-black border-black overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-75"
                  >
                    {/* Gradient Accent Line */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{
                        background: "#f4aeba",
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 + i * 0.05 }}
                    />

                    <div className="flex items-center gap-6 p-6 pl-8">
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex-shrink-0"
                      >
                        <div className="relative">
                          <img
                            src={item.products.image_url}
                            className="w-24 h-24 object-cover rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                            alt={item.products.name}
                            style={{
                              border: "2px solid rgba(250,172,191,0.3)",
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#ec729c] rounded-none flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-black text-[10px] font-black">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-black text-lg leading-tight truncate mb-2">
                          {item.products.name}
                        </h3>
                        <p className="text-sm font-bold text-black mb-1">
                          Rs.{item.products.price}
                          <span className="text-black font-medium ml-1">
                            / piece
                          </span>
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={item.quantity}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[11px] font-black uppercase tracking-[0.15em] text-black"
                          >
                            Subtotal:{" "}
                            {formatPrice(item.products.price * item.quantity)}
                          </motion.p>
                        </AnimatePresence>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-4 flex-shrink-0">
                        {/* Qty Pill */}
                        <div className="flex items-center gap-1 rounded-none px-2 py-2 border-4 border-black border-black bg-[#fdfdcb]">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity, -1)
                            }
                            className="w-8 h-8 rounded-sm flex items-center justify-center font-black text-sm transition-all duration-75 bg-[#fdfdcb] text-black hover:bg-[#ec729c] hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </motion.button>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className="w-8 text-center font-black text-sm text-black"
                            >
                              {item.quantity}
                            </motion.span>
                          </AnimatePresence>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity, +1)
                            }
                            className="w-8 h-8 rounded-sm flex items-center justify-center font-black text-sm transition-all duration-75 bg-[#fdfdcb] text-black hover:bg-[#ec729c] hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </motion.button>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] font-black px-4 py-2 rounded-none transition-all duration-75 bg-[#c54c82] text-black border-4 border-black border-black hover:bg-[#c54c82] hover:text-black hover:border-black"
                        >
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:col-span-2 sticky top-8"
            >
              <div className="rounded-none overflow-hidden bg-[#fdfdcb]  border-4 border-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {/* Summary Header */}
                <div
                  className="px-8 py-8 relative overflow-hidden"
                  style={{
                    background: "#ec729c",
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdfdcb] rounded-none -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#fdfdcb] rounded-none translate-y-1/2 -translate-x-1/2" />

                  <p className="text-black text-[10px] font-black uppercase tracking-[0.25em] mb-2 relative z-10">
                    Order Summary
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={totalAmount}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-4xl font-black text-black relative z-10"
                    >
                      {formatPrice(totalAmount)}
                    </motion.h2>
                  </AnimatePresence>
                  <p className="text-black text-xs mt-2 font-medium relative z-10">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="px-8 py-8 space-y-5">
                  {/* Line Items */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {cartItems.map((item) => (
                        <motion.div
                          layout
                          key={item.id}
                          className="flex justify-between text-xs items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <span className="text-black font-medium truncate max-w-[150px]">
                            {item.products.name}
                            <span className="text-black ml-1">
                              x{item.quantity}
                            </span>
                          </span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={item.quantity}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="font-black text-black"
                            >
                              {formatPrice(item.products.price * item.quantity)}
                            </motion.span>
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="h-px  from-transparent  to-transparent" />

                  <div className="flex justify-between text-sm items-center">
                    <span className="font-bold text-black">
                      Shipping
                    </span>
                    <span className="font-black text-black text-xs flex items-center gap-1">
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Chat to know more
                    </span>
                  </div>

                  <div className="h-px  from-transparent  to-transparent" />

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-black text-black text-base">
                      Total
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={totalAmount}
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-black text-2xl text-black"
                      >
                        {formatPrice(totalAmount)}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-none font-black text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mt-3 transition-all duration-75"
                    style={{
                      background: "#ec729c",
                    }}
                  >
                    {/* Shimmer Effect */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "#fdfdcb",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
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
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      Check Out
                    </span>
                  </motion.button>

                  <p className="text-[10px] text-black text-center font-medium leading-relaxed">
                    No payment taken here. We&apos;ll finalize your order via
                    WhatsApp.
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.8 }}
                className="flex justify-center gap-8 mt-6"
              >
                <div className="flex items-center gap-2 text-black">
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-[10px] font-semibold">Chat with us directly</span>
                </div>
                <div className="flex items-center gap-2 text-black">
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-[10px] font-semibold">Same item as shown here</span>
                </div>
                <div className="flex items-center gap-2 text-black">
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-[10px] font-semibold">Delivery charges based on location</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
