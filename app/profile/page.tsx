"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);

      const { data: historyData } = await supabase
        .from("whatsapp_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (historyData) setHistory(historyData);
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fdfdcb] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 rounded-none border-4 border-black border-t-transparent relative z-10"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-black font-medium tracking-wide relative z-10"
        >
          Loading your profile...
        </motion.p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfdcb] relative overflow-hidden py-16 px-6">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        
      </div>


      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Header & User Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-[#fdfdcb]  p-8 md:p-10 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black border-black"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-none flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  background: "#ec729c",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <div className="w-1.5 h-1.5 rounded-none bg-[#ec729c]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                    Account
                  </span>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-2">
                  My Profile
                </h1>
                <p className="text-sm text-black font-medium">
                  {user?.email}
                </p>
                <p className="text-[11px] text-black mt-1 font-medium">
                  Member since {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
              className="text-black text-sm font-black px-6 py-3 border-4 border-black rounded-none bg-[#fdfdcb]  transition-all duration-75 flex items-center gap-2"
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* WhatsApp History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
        >
          <div className="flex items-baseline gap-3 mb-6">
            <div className="w-2 h-2 rounded-none bg-[#ec729c]" />
            <h2 className="text-xl font-black text-black">
              Items You've Inquired About
            </h2>
          </div>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-[#fdfdcb]  p-12 rounded-none text-center border-4 border-black border-solid border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6"
              >
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ec729c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </motion.div>
              <p className="text-black font-bold mb-2">
                You haven't sent any WhatsApp inquiries yet
              </p>
              <p className="text-black text-sm mb-8 font-medium">
                Start exploring and reach out to us
              </p>
              <Link href="/shop">
                <motion.button
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-3.5 rounded-none text-black font-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-75"
                  style={{
                    background: "#ec729c",
                  }}
                >
                  Browse Collection
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {history.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: idx * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    className="bg-[#fdfdcb]  p-6 rounded-none flex justify-between items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black border-black transition-all duration-75"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-[#fdfdcb] flex items-center justify-center flex-shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ec729c"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black text-black text-sm">
                          {item.product_name}
                        </h3>
                        <p className="text-[11px] text-black font-bold mt-1">
                          Inquired on{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-black text-black">
                        Rs.{item.price}
                      </p>
                      <Link href={`/product/?slug=${item.product_id}`}>
                        <motion.span
                          whileHover={{ x: 2 }}
                          className="text-[10px] text-black font-black uppercase tracking-wider flex items-center gap-1 hover:text-black transition-colors"
                        >
                          View Product
                          <svg
                            width="10"
                            height="10"
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
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
