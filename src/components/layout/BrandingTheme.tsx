// src/components/layout/BrandingTheme.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBranding } from "@/hooks/useBranding";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export default function BrandingTheme() {
  const pathname = usePathname();
  const branding = useBranding();
  const accent = branding?.accentColor;
  const isPlatformAdmin = pathname.startsWith("/platform-admin");

  useEffect(() => {
    const root = document.documentElement;
    if (!isPlatformAdmin && accent && HEX_COLOR.test(accent)) {
      root.style.setProperty("--primary", accent);
      root.style.setProperty("--brand-rail", accent);
      root.setAttribute("data-branded", "true");
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--brand-rail");
      root.removeAttribute("data-branded");
    }
  }, [accent, isPlatformAdmin]);

  return null;
}