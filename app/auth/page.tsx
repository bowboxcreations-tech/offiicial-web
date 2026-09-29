"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TOKENS } from "@/components/Tokens";

// ── Color Tokens (Pastel Premium Theme) ─────────────────────────────────────
// ── SVG Icon Components ─────────────────────────────────────────────────────
const MailIcon = ({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparkleIcon = ({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

const GiftIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
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
);

const FlowerIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 0 4.5-4.5M12 16.5V15m4.5-3a4.5 4.5 0 1 1-4.5-4.5M16.5 12H15" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const StarIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RibbonIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
    <path d="M12 3v12" />
    <circle cx="12" cy="21" r="1" />
  </svg>
);

// ── Floating Particles ──────────────────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 16 }).map((_, i) => {
        const colors = [TOKENS.cream, TOKENS.peach, TOKENS.rose, TOKENS.pink];
        const color = colors[i % 4];
        const size = 3 + Math.random() * 6;
        const left = `${(i * 6.7) % 100}%`;
        const top = `${(i * 8.3 + 5) % 100}%`;
        const duration = 7 + Math.random() * 10;
        const delay = Math.random() * 4;

        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-none"
            style={{
              width: size,
              height: size,
              background: color,
              left,
              top,
              opacity: 0.12,
              filter: "none",
            }}
            animate={{
              y: [0, -25, 0, 15, 0],
              x: [0, 12, -8, 4, 0],
              scale: [1, 1.15, 0.85, 1.05, 1],
              opacity: [0.12, 0.22, 0.08, 0.18, 0.12],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert(isSignUp ? "Check your email for confirmation!" : "Welcome back!");
      router.push("/");
    }
    setLoading(false);
  };

  const floatingIcons = [
    { Icon: GiftIcon, color: TOKENS.peach, left: "8%", top: "15%", size: 28 },
    { Icon: FlowerIcon, color: TOKENS.rose, left: "28%", top: "8%", size: 24 },
    {
      Icon: SparkleIcon,
      color: TOKENS.peach,
      left: "48%",
      top: "12%",
      size: 22,
    },
    { Icon: HeartIcon, color: TOKENS.peach, left: "68%", top: "18%", size: 26 },
    { Icon: StarIcon, color: TOKENS.cream, left: "88%", top: "10%", size: 24 },
    { Icon: RibbonIcon, color: TOKENS.rose, left: "18%", top: "75%", size: 22 },
    { Icon: GiftIcon, color: TOKENS.peach, left: "78%", top: "72%", size: 26 },
    { Icon: HeartIcon, color: TOKENS.cream, left: "55%", top: "82%", size: 24 },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 transition-colors duration-75"
      style={{
        background:
          "#f4aeba",
      }}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.peach,
            width: 400,
            height: 400,
            left: "-5%",
            top: "-10%",
            opacity: 0.15,
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.pink,
            width: 350,
            height: 350,
            right: "-8%",
            top: "20%",
            opacity: 0.12,
          }}
          animate={{ scale: [1, 1.15, 1], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.cream,
            width: 300,
            height: 300,
            left: "30%",
            bottom: "-5%",
            opacity: 0.18,
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.rose,
            width: 280,
            height: 280,
            right: "15%",
            bottom: "10%",
            opacity: 0.1,
          }}
          animate={{ scale: [1, 1.25, 1], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <FloatingParticles />

      {/* Floating decorative icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: item.left, top: item.top }}
          animate={{
            y: [0, -16, 0],
            rotate: [0, i % 2 === 0 ? 8 : -8, 0],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        >
          <item.Icon
            style={{ color: item.color, width: item.size, height: item.size }}
          />
        </motion.div>
      ))}

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow halo behind card */}
        <motion.div
          className="absolute inset-0 rounded-none hidden pointer-events-none"
          style={{
            background: `${TOKENS.peach}`,
          }}
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient border wrapper */}
        <motion.div
          className="relative rounded-none p-[1.5px]"
          style={{
            background: `${TOKENS.peach}`,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div
            className="rounded-none overflow-hidden "
            style={{
              background: TOKENS.glass,
              border: `1px solid rgba(255,255,255,0.6)`,
            }}
          >
            {/* Top decorative band */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `${TOKENS.peach}`,
                backgroundSize: "200% 100%",
              }}
            />

            <div className="px-10 py-10">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
                className="w-16 h-16 rounded-none mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              >
                <img src="/logo-circle.jpg" width="64" height="64" alt="Bowbox Logo" className="w-full h-full object-cover rounded-none" loading="eager" />
              </motion.div>

              {/* Animated heading swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signup-head" : "signin-head"}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-center mb-8"
                >
                  <h2
                    className="text-3xl font-black tracking-tight mb-1"
                    style={{
                      color: TOKENS.textDark,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {isSignUp ? "Join BOWBOX" : "Welcome Back"}
                  </h2>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: TOKENS.peach }}
                  >
                    {isSignUp ? "Create your account" : "Sign in to continue"}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.25 }}
                  className="relative group"
                >
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                    style={{ color: TOKENS.textLight }}
                  >
                    <MailIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-sm text-sm outline-none transition-all border-4 border-black placeholder-black"
                    style={{
                      background: "#fdfdcb",
                      borderColor: "#000000",
                      color: TOKENS.textDark,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                      e.currentTarget.style.background = "#f4aeba";
                          e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                      e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = "#fdfdcb";
                    }}
                  />
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.32 }}
                  className="relative"
                >
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                    style={{ color: TOKENS.textLight }}
                  >
                    <LockIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-sm text-sm outline-none transition-all border-4 border-black placeholder-black"
                    style={{
                      background: "#fdfdcb",
                      borderColor: "#000000",
                      color: TOKENS.textDark,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                      e.currentTarget.style.background = "#f4aeba";
                          e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                      e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = "#fdfdcb";
                    }}
                  />
                </motion.div>

                {/* Inline error */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-sm px-4 py-2.5 text-xs font-bold flex items-center gap-2"
                      style={{
                        background: "#000000",
                        border: "1px solid rgba(255,183,178,0.4)",
                        color: "#c54c82",
                      }}
                    >
                      <CloseIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-sm font-black text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-1 disabled:bg-[#f4aeba] disabled:cursor-not-allowed transition-all relative overflow-hidden flex items-center justify-center gap-2"
                    style={{
                      background: `${TOKENS.peach}`,
                      boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                    }}
                  >
                    {/* shimmer effect */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "#fdfdcb",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {loading ? (
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.75,
                            ease: "linear",
                          }}
                          className="block w-4 h-4 border-4 border-black border-t-transparent rounded-none"
                        />
                        Processing...
                      </span>
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={isSignUp ? "create" : "signin"}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex items-center gap-2 relative z-10"
                        >
                          <SparkleIcon className="w-3.5 h-3.5" />
                          {isSignUp ? "Create Account" : "Sign In"}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div
                  className="flex-1 h-px"
                  style={{ background: "#000000" }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: TOKENS.textLight }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "#000000" }}
                />
              </div>

              {/* Toggle sign-in / sign-up */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
                className="text-center text-xs"
                style={{ color: TOKENS.textMid }}
              >
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <motion.button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg("");
                  }}
                  whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  className="font-black underline underline-offset-2 transition-colors"
                  style={{ color: TOKENS.peach }}
                >
                  {isSignUp ? "Sign In" : "Sign Up Free"}
                </motion.button>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}