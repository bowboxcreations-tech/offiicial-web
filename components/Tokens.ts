// ── Color Tokens (NEO-BRUTALIST Theme) ─────────────────────────────────────
// SHARED SINGLE SOURCE OF TRUTH for the visual layer.
// Palette: Deep Pink (primary) / Bright Pink (secondary) / Soft Pink (tertiary) / Pale Yellow (neutral)
// All text is pure black. All backgrounds are flat solid colors.
export const TOKENS = {
  // Legacy key names preserved so every existing reference keeps working.
  cream: "#fdfdcb", // Pale Yellow — neutral / background
  peach: "#c54c82", // Deep Pink — primary
  rose: "#f4aeba", // Soft Pink — tertiary
  pink: "#ec729c", // Bright Pink — secondary
  creamLight: "#fdfdcb",
  peachLight: "#f4aeba",
  roseLight: "#f4aeba",
  pinkLight: "#f4aeba",
  textDark: "#000000", // pure black — the only text color
  textMid: "#000000",
  textLight: "#000000",
  white: "#fdfdcb", // flat neutral surface (no pure white in this system)
  glass: "#fdfdcb", // no translucency — flat panels
  glassDark: "#fdfdcb",
  black: "#000000",
} as const;

// ── Brutalist elevation (hard, sharp, offset solid shadow — no blur) ───────
export const CLAY_SHADOW = "6px 6px 0px 0px rgba(0,0,0,1)";
export const CLAY_SHADOW_PUFF = "8px 8px 0px 0px rgba(0,0,0,1)";
export const CLAY_SHADOW_DARK = "6px 6px 0px 0px rgba(0,0,0,1)";
export const NO_SHADOW = "0px 0px 0px 0px rgba(0,0,0,1)";

// ── Brutalist motion (snappy high-stiffness spring) ────────────────────────
export const CLAY_SPRING = { type: "spring", stiffness: 400, damping: 10 } as const;
