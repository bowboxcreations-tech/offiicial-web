// ── Color Tokens (NEO-BRUTALIST POP ART Theme) ─────────────────────────────
// SHARED SINGLE SOURCE OF TRUTH for the visual layer.
// Palette: Hot Pink (primary) / Cyan (secondary) / Electric Yellow (tertiary) / Black+White
export const TOKENS = {
  // Legacy key names preserved so every existing reference keeps working.
  cream: "#FFFFFF", // Stark White — neutral / background / dark-mode text
  peach: "#FF007F", // Hot Pink — primary
  rose: "#FFF500", // Electric Yellow — tertiary accent
  pink: "#00FFFF", // Cyan — secondary accent
  creamLight: "#FFFDE7",
  peachLight: "#FFE0EE",
  roseLight: "#FFF9C4",
  pinkLight: "#DFFFFF",
  textDark: "#000000", // pure black — brutalist core
  textMid: "#1A1A1A",
  textLight: "#4A4A4A",
  white: "#FFFFFF",
  glass: "#FFFFFF", // no translucency — flat panels
  glassDark: "#111111",
} as const;

// ── Brutalist elevation (hard, sharp, offset solid shadow — no blur) ───────
export const CLAY_SHADOW = "6px 6px 0px 0px rgba(0,0,0,1)";
export const CLAY_SHADOW_PUFF = "8px 8px 0px 0px rgba(0,0,0,1)";
export const CLAY_SHADOW_DARK = "6px 6px 0px 0px rgba(0,0,0,1)";

// ── Brutalist motion (snappy high-stiffness spring) ────────────────────────
export const CLAY_SPRING = { type: "spring", stiffness: 400, damping: 10 } as const;
