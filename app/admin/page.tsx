"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { TOKENS } from "@/components/Tokens";

// ═══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  main_category: string;
  sub_category?: string;
  image_url: string;
  image_gallery?: string[];
  created_at?: string;
  is_new_arrival?: boolean;    // <-- Add this
  is_special?: boolean;        // <-- Add this
  is_best_seller?: boolean;    // <-- Add this
}

interface QueueItem {
  id: string;
  type: "file" | "link";
  file?: File;
  url?: string;
  preview: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  THEME TOKENS
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
//  SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════════
const PackageIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const MessageIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

const ClipboardIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const CloseIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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

const SparkleIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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

const EditIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const FileIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const LinkIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const ArrowRightIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ImageIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const LogoutIcon = ({
  className = "w-4 h-4",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const JewelIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M11 3L8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const FlowerIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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

const BoxIcon = ({
  className = "w-5 h-5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  SAFE IMAGE COMPONENT  (Google Drive Fallback Chain)
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Tries to render an image with automatic fallback:
 * 1. lh3.googleusercontent.com (full quality)
 * 2. drive.google.com/thumbnail (compressed)
 * 3. Placeholder UI (if both fail)
 */
const SafeImage = ({
  src,
  alt,
  className = "",
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  if (failed || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#fdfdcb] border-4 border-solid ${className}`}
        style={{ borderColor: "#000000", ...style }}
      >
        <ImageIcon className="w-5 h-5 mb-1" style={{ color: "#000000" }} />
        <span className="text-[9px] font-bold text-black uppercase tracking-wider">
          Broken
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        // Fallback 1: lh3 failed → try thumbnail endpoint
        if (currentSrc.includes("lh3.googleusercontent.com/d/")) {
          const match = currentSrc.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (match?.[1]) {
            setCurrentSrc(
              `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`,
            );
            return;
          }
        }
        // Fallback 2: everything failed
        setFailed(true);
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  GOOGLE DRIVE CONVERTER  (2026 Working)
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Converts a Google Drive sharing URL into a direct image CDN link.
 * Supports: /file/d/ID, /d/ID, open?id=ID, and raw ID strings.
 * Returns the original URL if it doesn't match Drive patterns.
 */
const convertToDirectLink = (url: string): string => {
  if (!url?.trim()) return "";
  const trimmed = url.trim();

  // Already converted or non-Drive direct link
  if (
    trimmed.includes("lh3.googleusercontent.com") ||
    trimmed.includes("drive.google.com/thumbnail") ||
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(trimmed)
  ) {
    return trimmed;
  }

  // Extract file ID from every known Drive URL format
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{25,})/, // drive.google.com/file/d/FILE_ID/view
    /\/d\/([a-zA-Z0-9_-]{25,})/, // drive.google.com/d/FILE_ID/
    /open\?id=([a-zA-Z0-9_-]{25,})/, // drive.google.com/open?id=FILE_ID
    /id=([a-zA-Z0-9_-]{25,})/, // ?id=FILE_ID
  ];

  let fileId = "";
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId) return trimmed;

  // 2026 best endpoint: Google Image CDN with original-size flag (=s0)
  return `https://lh3.googleusercontent.com/d/${fileId}=s0`;
};

/** Returns true if a URL is already hosted on Supabase Storage */
const isSupabaseUrl = (url: string): boolean =>
  url.includes(".supabase.co/storage") || url.includes(".supabase.in/storage");

// ═══════════════════════════════════════════════════════════════════════════════
//  FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════════════════════════
function FloatingParticles() {
  const [particles, setParticles] = useState<
    {
      id: string;
      color: string;
      size: number;
      left: string;
      top: string;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const colors = [TOKENS.cream, TOKENS.peach, TOKENS.rose, TOKENS.pink];
    setParticles(
      Array.from({ length: 18 }).map((_, i) => ({
        id: `p-${i}`,
        color: colors[i % 4],
        size: 3 + Math.random() * 7,
        left: `${(i * 5.7) % 100}%`,
        top: `${(i * 7.3 + 5) % 100}%`,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-none"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: p.left,
            top: p.top,
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
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Admin allowlist (env-injected at build time, NOT a secret) ─────────────
  // SECURITY: the real access control is Supabase RLS on the products /
  // testimonials tables (see AUDIT_REPORT.md). This check only gates the UI;
  // it is cosmetic and must never be treated as protection by itself.
  const ADMIN_ALLOWLIST = [
    process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
    process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
  ].filter(Boolean) as string[];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(false);

    // Fail closed: if no allowlist is configured, nobody gets in.
    const emailAllowed =
      ADMIN_ALLOWLIST.length > 0 &&
      ADMIN_ALLOWLIST.includes(adminEmail.trim().toLowerCase());

    // Real password verification happens against Supabase Auth.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail.trim(),
      password: adminPassword,
    });

    if (!error && data.user && emailAllowed) {
      setIsAdminLoggedIn(true);
      fetchInventory();
    } else {
      // Best-effort cleanup of the session when the allowlist rejects the user.
      if (data?.session) await supabase.auth.signOut();
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
    setIsSubmitting(false);
  };

  // ── Inventory ───────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);

  const fetchInventory = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  }, []);

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Delete this item forever?")) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // ── Upload States ───────────────────────────────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Jewellery");
  const [subCategory, setSubCategory] = useState("");

  const [imageQueue, setImageQueue] = useState<QueueItem[]>([]);
  const [tempLink, setTempLink] = useState("");

  // Testimonial states
  const [testimonialName, setTestimonialName] = useState("");
  const [testUploadType, setTestUploadType] = useState<"file" | "link">("file");
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testUrl, setTestUrl] = useState("");

  // ── Queue Helpers ───────────────────────────────────────────────────────────
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems: QueueItem[] = Array.from(e.target.files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      type: "file",
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageQueue((prev) => [...prev, ...newItems]);
  };

  const handleAddLink = () => {
    if (!tempLink) return;
    const converted = convertToDirectLink(tempLink);
    setImageQueue((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type: "link",
        url: tempLink,
        preview: converted,
      },
    ]);
    setTempLink("");
  };

  const handleRemoveItem = (id: string) => {
    setImageQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Edit Mode ───────────────────────────────────────────────────────────────
  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.main_category);
    setSubCategory(product.sub_category || "");
    setIsNewArrival(product.is_new_arrival || false);
    setIsSpecial(product.is_special || false);
    setIsBestSeller(product.is_best_seller || false);

    const existingImages = product.image_gallery?.length
      ? product.image_gallery
      : [product.image_url];

    setImageQueue(
      existingImages.map((url) => ({
        id: Math.random().toString(36).substring(7),
        type: "link" as const,
        url,
        preview: url,
      })),
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("Jewellery");
    setSubCategory("");
    setImageQueue([]);
    setTempLink("");
    setIsNewArrival(false); setIsSpecial(false); setIsBestSeller(false);
  };

  // ── Core Upload Logic ───────────────────────────────────────────────────────
  /**
   * Uploads a single queue item to Supabase Storage.
   * For Drive links: fetches the image from Google's CDN, then uploads to Supabase
   * so you get a permanent, fast URL instead of a fragile hotlink.
   */
  const processQueueItem = async (item: QueueItem): Promise<string> => {
    // ── File upload ──
    if (item.type === "file" && item.file) {
      const fileName = `${Date.now()}_${item.file.name.replace(/\s/g, "_")}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, item.file);
      if (error) throw error;
      return supabase.storage.from("product-images").getPublicUrl(fileName).data
        .publicUrl;
    }

    // ── Link processing ──
    if (item.type === "link" && item.url) {
      // Already stored on Supabase? Pass through.
      if (isSupabaseUrl(item.url)) return item.url;

      const directUrl = convertToDirectLink(item.url);

      // Non-Drive URLs (e.g. direct CDN links) pass through
      if (
        !item.url.includes("drive.google.com") &&
        !item.url.includes("googleusercontent.com")
      ) {
        return directUrl;
      }

      // ── THE FIX: Fetch from Drive CDN → upload to Supabase ──
      try {
        const res = await fetch(directUrl, { method: "GET", mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        const ext = blob.type.includes("png")
          ? "png"
          : blob.type.includes("webp")
            ? "webp"
            : "jpg";
        const fileName = `drive-import-${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, blob, {
            contentType: blob.type || "image/jpeg",
          });
        if (error) throw error;

        return supabase.storage.from("product-images").getPublicUrl(fileName)
          .data.publicUrl;
      } catch (err) {
        console.warn("Drive proxy failed, storing direct link:", err);
        // Last resort: store the converted Drive URL (may break later)
        return directUrl;
      }
    }

    return "";
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageQueue.length === 0) {
      alert("Please add at least one image to the queue!");
      return;
    }

    setIsUploading(true);
    try {
      const finalGalleryUrls = await Promise.all(
        imageQueue.map(processQueueItem),
      );
      const validUrls = finalGalleryUrls.filter(Boolean);
      if (validUrls.length === 0)
        throw new Error("No images could be processed.");

      // Auto-generate a beautiful, unique link using the product name and a timestamp
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

      const productData = {
        name,
        price: parseFloat(price),
        description,
        main_category: category,
        sub_category: subCategory,
        image_url: validUrls[0],
        image_gallery: validUrls,
        is_new_arrival: isNewArrival,    
        is_special: isSpecial,           
        is_best_seller: isBestSeller,    
        slug: generatedSlug, // <-- ADDED THE SLUG GENERATOR HERE
      };

      if (editingProductId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProductId);
        if (error) throw error;
        alert("Product updated successfully!");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        alert("Product successfully added!");
      }

      fetchInventory();
      cancelEdit();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalUrl = "";

      if (testUploadType === "link" && testUrl) {
        if (isSupabaseUrl(testUrl)) {
          finalUrl = testUrl;
        } else {
          const directUrl = convertToDirectLink(testUrl);
          if (
            testUrl.includes("drive.google.com") ||
            testUrl.includes("googleusercontent.com")
          ) {
            try {
              const res = await fetch(directUrl, {
                method: "GET",
                mode: "cors",
              });
              if (!res.ok) throw new Error("Fetch failed");
              const blob = await res.blob();
              const ext = blob.type.includes("png") ? "png" : "jpg";
              const fileName = `testimonial-drive-${Date.now()}.${ext}`;
              const { error } = await supabase.storage
                .from("testimonial-images")
                .upload(fileName, blob);
              if (error) throw error;
              finalUrl = supabase.storage
                .from("testimonial-images")
                .getPublicUrl(fileName).data.publicUrl;
            } catch {
              finalUrl = directUrl;
            }
          } else {
            finalUrl = directUrl;
          }
        }
      } else if (testUploadType === "file" && testFile) {
        const fileName = `${Date.now()}_${testFile.name.replace(/\s/g, "_")}`;
        const { error } = await supabase.storage
          .from("testimonial-images")
          .upload(fileName, testFile);
        if (error) throw error;
        finalUrl = supabase.storage
          .from("testimonial-images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      if (!finalUrl) throw new Error("No image provided");

      const { error } = await supabase
        .from("testimonials")
        .insert([
          {
            customer_name: testimonialName || "Happy Customer",
            image_url: finalUrl,
          },
        ]);
      if (error) throw error;

      alert("Testimonial added!");
      setTestimonialName("");
      setTestFile(null);
      setTestUrl("");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  //  LOGIN SCREEN
  // ═════════════════════════════════════════════════════════════════════════════
  if (!isAdminLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden p-6"
        style={{
          background:
            "#f4aeba",
        }}
      >
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

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative z-10 w-full max-w-md mx-6"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-none hidden pointer-events-none"
              style={{
                background: `${TOKENS.peach}`,
              }}
              animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative rounded-none p-[1.5px]"
              style={{
                background: `${TOKENS.peach}`,
              }}
            >
              <div
                className="rounded-none overflow-hidden "
                style={{
                  background: TOKENS.glass,
                  border: `1px solid rgba(255,255,255,0.6)`,
                }}
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `${TOKENS.peach}`,
                    backgroundSize: "200% 100%",
                  }}
                />
                <div className="px-10 py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-none mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                  >
                    <img src="/logo-circle.jpg" width="64" height="64" alt="Bowbox Logo" className="w-full h-full object-cover rounded-none" loading="eager" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
                    className="text-3xl font-black text-center mb-1 tracking-tight"
                    style={{
                      color: TOKENS.textDark,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Command Centre
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
                    className="text-center text-xs mb-8 font-bold uppercase tracking-[0.2em]"
                    style={{ color: TOKENS.peach }}
                  >
                    BOWBOX ADMIN — RESTRICTED ACCESS
                  </motion.p>

                  <motion.form
                    onSubmit={handleAdminLogin}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.55 }}
                  >
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Admin Email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full p-4 rounded-sm text-sm outline-none transition-all placeholder-black border-4 border-black"
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
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full p-4 rounded-sm text-sm outline-none transition-all placeholder-black border-4 border-black"
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
                    </div>

                    <AnimatePresence>
                      {loginError && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-center font-bold flex items-center justify-center gap-1.5"
                          style={{ color: "#c54c82" }}
                        >
                          <CloseIcon className="w-3.5 h-3.5" /> Invalid
                          credentials. Try again.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-sm font-black text-black text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all mt-2 relative overflow-hidden flex items-center justify-center gap-2"
                      style={{
                        background: `${TOKENS.peach}`,
                        boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                      }}
                    >
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
                      <span className="relative z-10 flex items-center gap-2">
                        Unlock Dashboard <ArrowRightIcon className="w-4 h-4" />
                      </span>
                    </motion.button>
                  </motion.form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  //  DASHBOARD
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="min-h-screen font-sans relative"
      style={{
        background:
          "#f4aeba",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.cream,
            width: 400,
            height: 400,
            left: "-5%",
            top: "5%",
            opacity: 0.12,
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.peach,
            width: 350,
            height: 350,
            right: "-5%",
            top: "30%",
            opacity: 0.1,
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-none hidden"
          style={{
            background: TOKENS.pink,
            width: 300,
            height: 300,
            left: "40%",
            bottom: "-5%",
            opacity: 0.08,
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <FloatingParticles />

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="sticky top-0 z-50 border-b-4 border-black "
        style={{
          background: "#fdfdcb",
          borderColor: "#000000",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <img src="/logo-circle.jpg" width="32" height="32" alt="Bowbox Logo" className="w-8 h-8 object-cover" loading="eager" />
            </div>
            <div>
              <h1
                className="text-lg font-black tracking-tight"
                style={{ color: TOKENS.textDark }}
              >
                BOWBOX COMMAND
              </h1>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] -mt-0.5"
                style={{ color: TOKENS.textLight }}
              >
                Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-none border-4 border-black"
              style={{
                background: TOKENS.creamLight,
                borderColor: "#000000",
              }}
            >
              <span
                className="w-2 h-2 rounded-none animate-pulse"
                style={{ background: TOKENS.peach }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: TOKENS.textMid }}
              >
                {products.length} Products Live
              </span>
            </div>
            <motion.button
              whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdminLoggedIn(false)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-none font-bold text-xs border-4 border-black transition-all"
              style={{
                background: TOKENS.roseLight,
                color: TOKENS.rose,
                borderColor: "#000000",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = TOKENS.rose;
                e.currentTarget.style.color = TOKENS.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = TOKENS.roseLight;
                e.currentTarget.style.color = TOKENS.rose;
              }}
            >
              <LogoutIcon className="w-3.5 h-3.5" /> Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Total Products",
              value: products.length,
              color: TOKENS.peach,
              bg: TOKENS.pinkLight,
              icon: PackageIcon,
            },
            {
              label: "Jewellery",
              value: products.filter((p) => p.main_category === "Jewellery")
                .length,
              color: TOKENS.peach,
              bg: TOKENS.peachLight,
              icon: JewelIcon,
            },
            {
              label: "Boxes",
              value: products.filter((p) => p.main_category === "Boxes")
                .length,
              color: TOKENS.rose,
              bg: TOKENS.roseLight,
              icon: BoxIcon,
            },
            {
              label: "New Arrivals",
              value: products.filter((p) => p.is_new_arrival).length,
              color: TOKENS.textMid,
              bg: TOKENS.creamLight,
              icon: SparkleIcon,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.15 + i * 0.07 }}
              whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className="rounded-none p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] "
              style={{ background: stat.bg, borderColor: "#000000" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: TOKENS.textLight }}
                >
                  {stat.label}
                </p>
              </div>
              <p className="text-3xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Upload */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.25 }}
              className="rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden "
              style={{
                background: TOKENS.glass,
                borderColor: "#000000",
              }}
            >
              <div
                className="px-7 py-5 border-b-4 border-black flex items-center gap-3"
                style={{
                  background: `${TOKENS.peach}`,
                  borderColor: "#000000",
                }}
              >
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    background: `${TOKENS.peach}`,
                  }}
                >
                  <PackageIcon className="w-4 h-4" />
                </div>
                <h2
                  className="text-base font-black tracking-tight"
                  style={{ color: TOKENS.textDark }}
                >
                  {editingProductId
                    ? "Edit Product Details"
                    : "Upload New Product"}
                </h2>
              </div>

              <div className="p-7">
                {/* Image Queue */}
                <div
                  className="p-4 rounded-sm mb-6 border-4 border-black"
                  style={{
                    background: "#fdfdcb",
                    borderColor: "#000000",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon
                      className="w-4 h-4"
                      style={{ color: TOKENS.peach }}
                    />
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: TOKENS.textLight }}
                    >
                      Image Queue
                    </p>
                  </div>

                  <div
                    className="flex gap-2 overflow-x-auto mb-4 pb-2"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {imageQueue.map((item) => (
                      <div
                        key={item.id}
                        className="relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border-4 group"
                        style={{ borderColor: "#000000" }}
                      >
                        <SafeImage
                          src={item.preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          whileTap={{ scale: 0.98 }}
                          className="absolute top-0 right-0 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-none transition-all opacity-0 group-hover:opacity-100"
                          style={{ background: TOKENS.rose }}
                        >
                          <CloseIcon className="w-3 h-3" />
                        </motion.button>
                      </div>
                    ))}
                    {imageQueue.length === 0 && (
                      <p
                        className="text-xs py-4"
                        style={{ color: TOKENS.textLight }}
                      >
                        No images added yet
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        className="text-[10px] font-bold block mb-1 uppercase tracking-wider"
                        style={{ color: TOKENS.textLight }}
                      >
                        Add Local Files (Select Multiple)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddFiles}
                        className="text-xs w-full"
                        style={{ color: TOKENS.textMid }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste Drive Link..."
                        value={tempLink}
                        onChange={(e) => setTempLink(e.target.value)}
                        className="text-xs p-2.5 rounded-sm flex-1 outline-none transition-all border-4 border-black"
                        style={{
                          background: "#fdfdcb",
                          borderColor: "#000000",
                          color: TOKENS.textDark,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={handleAddLink}
                        whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        whileTap={{ scale: 0.98 }}
                        className="text-black text-xs px-4 rounded-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        style={{
                          background: `${TOKENS.peach}`,
                        }}
                      >
                        Add Link
                      </motion.button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
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
                    <input
                      type="number"
                      placeholder="Price (Rs.)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
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
                  </div>
                  <textarea
                    placeholder="Description (materials, size, story...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 rounded-sm text-sm outline-none transition-all border-4 border-black h-24 resize-none"
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
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
                      style={{
                        background: "#fdfdcb",
                        borderColor: "#000000",
                        color: TOKENS.textDark,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#000000";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#000000";
                      }}
                    >
                      {[
                        "Jewellery",
                        "Boxes",
                      ].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    {category === "Jewellery" && (
                      <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
                        style={{
                          background: "#fdfdcb",
                          borderColor: "#000000",
                          color: TOKENS.textDark,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                      >
                        <option value="">Select Sub-Category</option>
                        {[
                          "Pendant",
                          "Earring",
                          "Ring",
                          "Bracelet",
                          "Other Jewelleries",
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    )}
                    {/* HOMEPAGE PLACEMENT FLAGS */}
                  <div 
                    className="flex flex-wrap gap-4 p-4 rounded-sm border-4 border-black" 
                    style={{ background: "#fdfdcb", borderColor: "#000000" }}
                  >
                    <p className="w-full text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: TOKENS.textLight }}>
                      Feature on Homepage Sections:
                    </p>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: TOKENS.textDark }}>
                      <input 
                        type="checkbox" 
                        checked={isNewArrival} 
                        onChange={(e) => setIsNewArrival(e.target.checked)} 
                        className="w-4 h-4 rounded-none border-black text-black focus:ring-pink-500" 
                      />
                      New Arrival
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: TOKENS.textDark }}>
                      <input 
                        type="checkbox" 
                        checked={isSpecial} 
                        onChange={(e) => setIsSpecial(e.target.checked)} 
                        className="w-4 h-4 rounded-none border-black text-black focus:ring-pink-500" 
                      />
                      Special
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: TOKENS.textDark }}>
                      <input 
                        type="checkbox" 
                        checked={isBestSeller} 
                        onChange={(e) => setIsBestSeller(e.target.checked)} 
                        className="w-4 h-4 rounded-none border-black text-black focus:ring-pink-500" 
                      />
                      Best Seller
                    </label>
                  </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUploading}
                    className="w-full py-3.5 rounded-sm font-black text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-[#f4aeba] disabled:cursor-not-allowed relative overflow-hidden flex items-center justify-center gap-2"
                    style={{
                      background: isUploading ? TOKENS.rose : TOKENS.peach,
                      boxShadow: isUploading ? "none" : "6px 6px 0px 0px rgba(0,0,0,1)",
                    }}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear",
                          }}
                          className="block w-4 h-4 border-4 border-black border-t-transparent rounded-none"
                        />
                        Syncing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        <SparkleIcon className="w-3.5 h-3.5" />
                        {editingProductId
                          ? "Update Product"
                          : "Add Product to Website"}
                      </span>
                    )}
                  </motion.button>

                  {editingProductId && (
                    <motion.button
                      type="button"
                      onClick={cancelEdit}
                      whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-2 py-2 text-xs font-bold transition-all rounded-sm border-4 border-black"
                      style={{
                        color: TOKENS.textDark,
                        borderColor: "#000000",
                        background: "#fdfdcb",
                      }}
                    >
                      Cancel Editing / Clear Form
                    </motion.button>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.35 }}
              className="rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden "
              style={{
                background: TOKENS.glass,
                borderColor: "#000000",
              }}
            >
              <div
                className="px-7 py-5 border-b-4 border-black flex items-center gap-3"
                style={{
                  background: `${TOKENS.pink}`,
                  borderColor: "#000000",
                }}
              >
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    background: `${TOKENS.peach}`,
                  }}
                >
                  <MessageIcon className="w-4 h-4" />
                </div>
                <h2
                  className="text-base font-black tracking-tight"
                  style={{ color: TOKENS.textDark }}
                >
                  Add Customer Review
                </h2>
              </div>

              <div className="p-7">
                <div
                  className="flex gap-1 mb-5 p-1 rounded-sm"
                  style={{ background: "#fdfdcb" }}
                >
                  {(["file", "link"] as const).map((t) => (
                    <motion.button
                      key={t}
                      type="button"
                      onClick={() => setTestUploadType(t)}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 rounded-sm text-xs font-black transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background:
                          testUploadType === t ? "#fdfdcb" : "transparent",
                        color:
                          testUploadType === t ? TOKENS.pink : TOKENS.textLight,
                        boxShadow:
                          testUploadType === t
                            ? "0 1px 4px rgba(0,0,0,0.06)"
                            : "none",
                      }}
                    >
                      {t === "file" ? (
                        <FileIcon className="w-3.5 h-3.5" />
                      ) : (
                        <LinkIcon className="w-3.5 h-3.5" />
                      )}
                      {t === "file" ? "File" : "Link"}
                    </motion.button>
                  ))}
                </div>

                <form onSubmit={handleTestimonialSubmit} className="space-y-3">
                  <AnimatePresence mode="wait">
                    {testUploadType === "file" ? (
                      <motion.div
                        key="test-file"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="border-4 border-solid p-5 rounded-none"
                        style={{
                          borderColor: "#000000",
                          background: TOKENS.pinkLight,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setTestFile(e.target.files?.[0] || null)
                          }
                          className="w-full text-xs"
                          style={{ color: TOKENS.textMid }}
                          required
                        />
                      </motion.div>
                    ) : (
                      <motion.input
                        key="test-link"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        type="text"
                        placeholder="Review image URL..."
                        value={testUrl}
                        onChange={(e) => setTestUrl(e.target.value)}
                        className="w-full p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
                        style={{
                          background: "#fdfdcb",
                          borderColor: "#000000",
                          color: TOKENS.textDark,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#000000";
                        }}
                        required
                      />
                    )}
                  </AnimatePresence>

                  <input
                    type="text"
                    placeholder="Customer Name (optional)"
                    value={testimonialName}
                    onChange={(e) => setTestimonialName(e.target.value)}
                    className="w-full p-3 rounded-sm text-sm outline-none transition-all border-4 border-black"
                    style={{
                      background: "#fdfdcb",
                      borderColor: "#000000",
                      color: TOKENS.textDark,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#000000";
                    }}
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUploading}
                    className="w-full py-3.5 rounded-sm font-black text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:bg-[#f4aeba] disabled:cursor-not-allowed transition-all relative overflow-hidden flex items-center justify-center gap-2"
                    style={{
                      background: isUploading ? TOKENS.rose : TOKENS.peach,
                      boxShadow: isUploading ? "none" : "6px 6px 0px 0px rgba(0,0,0,1)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isUploading ? (
                        "Processing..."
                      ) : (
                        <>
                          <SparkleIcon className="w-3.5 h-3.5" /> Add Review to
                          Website
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Inventory */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
            className="lg:col-span-3 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden flex flex-col "
            style={{
              background: TOKENS.glass,
              borderColor: "#000000",
            }}
          >
            <div
              className="px-7 py-5 border-b-4 border-black flex items-center justify-between"
              style={{
                background: `${TOKENS.peach}`,
                borderColor: "#000000",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    background: `${TOKENS.peach}`,
                  }}
                >
                  <ClipboardIcon className="w-4 h-4" />
                </div>
                <h2
                  className="text-base font-black tracking-tight"
                  style={{ color: TOKENS.textDark }}
                >
                  Live Inventory
                </h2>
              </div>
              <span
                className="text-xs font-black px-3 py-1 rounded-none border-4 border-black"
                style={{
                  background: TOKENS.creamLight,
                  color: TOKENS.peach,
                  borderColor: "#000000",
                }}
              >
                {products.length} items
              </span>
            </div>

            <div
              className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[760px]"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${TOKENS.peach} transparent`,
              }}
            >
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="mb-4"
                  >
                    <PackageIcon
                      className="w-12 h-12"
                      style={{ color: "#000000" }}
                    />
                  </motion.div>
                  <p
                    className="font-black uppercase tracking-widest text-xs"
                    style={{ color: `${TOKENS.textLight}` }}
                  >
                    No products yet
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {products.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: i * 0.04 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-none border-4 border-black group transition-all"
                      style={{
                        background: "#fdfdcb",
                        borderColor: "#000000",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="relative h-14 w-14 rounded-none overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 border-4"
                          style={{ borderColor: "#000000" }}
                        >
                          <SafeImage
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p
                            className="font-black text-sm leading-tight mb-0.5"
                            style={{ color: TOKENS.textDark }}
                          >
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[10px] font-black text-black px-2 py-0.5 rounded-none"
                              style={{
                                background: `${TOKENS.peach}`,
                              }}
                            >
                              Rs.{p.price}
                            </span>
                            <span
                              className="text-[10px] font-bold uppercase"
                              style={{ color: TOKENS.textLight }}
                            >
                              {p.main_category}
                            </span>
                            {p.image_gallery && p.image_gallery.length > 1 && (
                              <span
                                className="text-[10px] font-black border-4 border-black px-2 py-0.5 rounded-none flex items-center gap-1"
                                style={{
                                  color: TOKENS.peach,
                                  borderColor: "#000000",
                                  background: TOKENS.peachLight,
                                }}
                              >
                                <ImageIcon className="w-3 h-3" />
                                {p.image_gallery.length} Images
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEditClick(p)}
                          className="w-9 h-9 flex items-center justify-center rounded-none transition-all opacity-0 group-hover:opacity-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-sm border-4 border-black"
                          style={{
                            background: TOKENS.creamLight,
                            color: TOKENS.peach,
                            borderColor: "#000000",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = TOKENS.peach;
                            e.currentTarget.style.color = TOKENS.white;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              TOKENS.creamLight;
                            e.currentTarget.style.color = TOKENS.peach;
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)", transition: { type: "spring", stiffness: 400, damping: 10 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-none transition-all opacity-0 group-hover:opacity-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-sm border-4 border-black"
                          style={{
                            background: TOKENS.roseLight,
                            color: TOKENS.rose,
                            borderColor: "#000000",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = TOKENS.rose;
                            e.currentTarget.style.color = TOKENS.white;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = TOKENS.roseLight;
                            e.currentTarget.style.color = TOKENS.rose;
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
