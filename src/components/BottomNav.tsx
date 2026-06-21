"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Hula", emoji: "🌟", activeColor: "#E91E63" },
  { href: "/excuse", label: "Excuse", emoji: "🙈", activeColor: "#E67E22" },
  { href: "/superpower", label: "Power", emoji: "⚡", activeColor: "#9B59B6" },
  { href: "/pickup", label: "Ligaw", emoji: "💘", activeColor: "#E91E63" },
  { href: "/ulam", label: "Ulam", emoji: "🍚", activeColor: "#FF6B35" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "white",
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        display: "flex",
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: isActive ? "20px" : "18px" }}>
              {item.emoji}
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? item.activeColor : "#9CA3AF",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
