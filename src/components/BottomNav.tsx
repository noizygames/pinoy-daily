"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Hula",
    emoji: "🌟",
    activeColor: "#E91E63",
  },
  {
    href: "/generators",
    label: "Generators",
    emoji: "🎮",
    activeColor: "#1a1a2e",
  },
  {
    href: "/compatibility",
    label: "Love Calc",
    emoji: "❤️",
    activeColor: "#E91E63",
  },
  {
    href: "/feedback",
    label: "Feedback",
    emoji: "💬",
    activeColor: "#9B59B6",
  },
];

const GENERATOR_PATHS = [
  "/generators",
  "/excuse",
  "/superpower",
  "/pickup",
  "/ulam",
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(item: (typeof NAV_ITEMS)[number]): boolean {
    if (item.href === "/") {
      return pathname === "/";
    }

    if (item.href === "/generators") {
      return GENERATOR_PATHS.includes(pathname);
    }

    return pathname === item.href;
  }

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
          const active = isActive(item);

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
                gap: "3px",
                transition: "opacity 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: active ? "26px" : "22px",
                  transition: "font-size 0.15s",
                  lineHeight: 1,
                }}
              >
                {item.emoji}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: active ? 700 : 400,
                  color: active ? item.activeColor : "#9CA3AF",
                  transition: "color 0.15s",
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
