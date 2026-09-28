"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TOKENS } from "./Tokens";

type ToastType = "success" | "error" | "info" | "warning";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

export const nextToastId = () => ++toastId;

const toastStyles: Record<
  ToastType,
  { bg: string; icon: string; border: string }
> = {
  success: {
    bg: "linear-gradient(135deg,#98FF98,#6EDC6E)",
    icon: "check",
    border: "rgba(152,255,152,0.5)",
  },
  error: {
    bg: "linear-gradient(135deg,#FFB7B2,#FF9E99)",
    icon: "close",
    border: "rgba(255,183,178,0.5)",
  },
  info: {
    bg: "linear-gradient(135deg,#ADD8E6,#8FC7DE)",
    icon: "info",
    border: "rgba(199,206,234,0.5)",
  },
  warning: {
    bg: "linear-gradient(135deg,#FDBCB4,#F5A396)",
    icon: "alert",
    border: "rgba(255,218,193,0.5)",
  },
};

// Static, trusted SVG markup (never contains user input — safe from XSS)
const iconSvg: Record<string, string> = {
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

export function ToastContainer({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: number) => void;
}) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const s = toastStyles[t.type];
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="pointer-events-auto relative flex items-center gap-3 px-5 py-4 rounded-3xl min-w-[280px] max-w-sm border-[3px] overflow-hidden backdrop-blur-xl"
            style={{
              background: TOKENS.glass,
              borderColor: s.border,
              boxShadow: "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)",
            }}
            role="status"
            aria-live="polite"
          >
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}
              dangerouslySetInnerHTML={{ __html: iconSvg[s.icon] }}
            />
            <p
              className="text-sm font-bold leading-snug flex-1"
              style={{ color: TOKENS.textDark }}
            >
              {t.message}
            </p>
            <motion.button
              whileTap={{ scale: 0.85, y: 2, transition: { type: "spring", stiffness: 120, damping: 20 } }}
              onClick={() => remove(t.id)}
              className="flex-shrink-0 ml-1 transition-colors"
              style={{ color: TOKENS.textLight }}
              aria-label="Dismiss notification"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = TOKENS.textDark)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = TOKENS.textLight)
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
            <motion.div
              className="absolute bottom-0 left-0 h-[3px] rounded-full"
              style={{ background: s.bg }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
