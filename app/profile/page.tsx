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
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
          Loading your profile...
        </motion.p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E6E6FA] relative overflow-hidden py-16 px-6">
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
            cx="22%"
            cy="14%"
            r="300"
            fill="#FDBCB4"
            filter="url(#blur1)"
            animate={{
              cx: ["22%", "27%", "17%", "22%"],
              cy: ["14%", "10%", "18%", "14%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="80%"
            cy="52%"
            r="260"
            fill="#ADD8E6"
            filter="url(#blur2)"
            animate={{
              cx: ["80%", "75%", "85%", "80%"],
              cy: ["52%", "57%", "47%", "52%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50%"
            cy="86%"
            r="210"
            fill="#ADD8E6"
            filter="url(#blur2)"
            animate={{
              cx: ["50%", "45%", "55%", "50%"],
              cy: ["86%", "81%", "91%", "86%"],
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

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Header & User Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_4px_32px_-12px_rgba(173,216,230,0.15)] border border-white/70"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #ADD8E6, #ADD8E6)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
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
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ADD8E6]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ADD8E6]">
                    Account
                  </span>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-black text-[#3A2E4F] tracking-tight mb-2">
                  My Profile
                </h1>
                <p className="text-sm text-[#3A2E4F]/50 font-medium">
                  {user?.email}
                </p>
                <p className="text-[11px] text-[#3A2E4F]/30 mt-1 font-medium">
                  Member since {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{
                scale: 1.04,
                backgroundColor: "#FDBCB4",
                color: "#fff",
                borderColor: "#FDBCB4",
              }}
              whileTap={{ scale: 0.96 }}
              className="text-[#FDBCB4] text-sm font-black px-6 py-3 border-2 border-[#FDBCB4]/30 rounded-full bg-white/50 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
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
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#ADD8E6]" />
            <h2 className="text-xl font-black text-[#3A2E4F]">
              Items You've Inquired About
            </h2>
          </div>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/60 backdrop-blur-xl p-12 rounded-[2.5rem] text-center border border-dashed border-[#ADD8E6]/30 shadow-[0_4px_24px_-8px_rgba(173,216,230,0.1)]"
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
                  stroke="#ADD8E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </motion.div>
              <p className="text-[#3A2E4F]/40 font-bold mb-2">
                You haven't sent any WhatsApp inquiries yet
              </p>
              <p className="text-[#3A2E4F]/30 text-sm mb-8 font-medium">
                Start exploring and reach out to us
              </p>
              <Link href="/shop">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 20px 40px -10px rgba(173,216,230,0.4)",
                  }}
                  whileTap={{ scale: 0.95, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                  className="px-10 py-3.5 rounded-full text-white font-black text-sm shadow-lg transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #ADD8E6, #ADD8E6)",
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
                    whileHover={{ y: -3, scale: 1.005 }}
                    className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] flex justify-between items-center shadow-[0_2px_16px_-6px_rgba(173,216,230,0.1)] border border-white/70 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#E6E6FA]/50 flex items-center justify-center flex-shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ADD8E6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black text-[#3A2E4F] text-sm">
                          {item.product_name}
                        </h3>
                        <p className="text-[11px] text-[#3A2E4F]/30 font-bold mt-1">
                          Inquired on{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-black text-[#ADD8E6]">
                        Rs.{item.price}
                      </p>
                      <Link href={`/product/?slug=${item.product_id}`}>
                        <motion.span
                          whileHover={{ x: 2 }}
                          className="text-[10px] text-[#ADD8E6] font-black uppercase tracking-wider flex items-center gap-1 hover:text-[#ADD8E6] transition-colors"
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
