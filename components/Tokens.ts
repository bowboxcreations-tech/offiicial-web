// ── Color Tokens (Kawaii Claymorphism Theme) ────────────────────────────────
// SHARED SINGLE SOURCE OF TRUTH for the visual layer.
// Palette: Soft Peach (primary) / Baby Blue (secondary) / Mint (tertiary) / Lilac (neutral)
export const TOKENS = {
  // Legacy key names preserved so every existing reference keeps working.
  cream: "#E6E6FA", // Lilac  — neutral / background / dark-mode text
  peach: "#FDBCB4", // Soft Peach — primary
  rose: "#98FF98", // Mint — tertiary accent
  pink: "#ADD8E6", // Baby Blue — secondary accent
  creamLight: "#F3F2FC",
  peachLight: "#FEE7E1",
  roseLight: "#E4F9E4",
  pinkLight: "#E9F4FA",
  textDark: "#3A2E4F", // deep purple-charcoal (never pure black)
  textMid: "#6E6390",
  textLight: "#9B90B8",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.72)",
  glassDark: "rgba(46, 36, 64, 0.82)",
} as const;

// ── Claymorphism elevation (double shadow: outer drop + inner inset) ────────
export const CLAY_SHADOW =
  "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05)";
export const CLAY_SHADOW_PUFF =
  "4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 8px rgba(0,0,0,0.05), inset 2px 2px 6px rgba(255,255,255,0.7)";
export const CLAY_SHADOW_DARK =
  "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 8px rgba(0,0,0,0.2)";

// ── Claymorphism motion (soft-bounce spring physics) ────────────────────────
export const CLAY_SPRING = { type: "spring", stiffness: 120, damping: 20 } as const;
