"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  accent?: "red" | "purple";
}

const navItems: NavItem[] = [
  { href: "/watchlist", label: "Risk Watchlist", accent: "red" },
  { href: "/providers", label: "Providers" },
  { href: "/check", label: "Check Provider" },
  { href: "/exclusions", label: "Exclusions", accent: "red" },
  { href: "/compare", label: "Compare" },
  { href: "/states", label: "States" },
  { href: "/procedures", label: "Procedures" },
  { href: "/insights", label: "Insights", accent: "purple" },
  { href: "/analysis", label: "Methodology" },
  { href: "/ml-analysis", label: "ML Methodology" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        let className = "text-[13px] font-medium px-3 py-1.5 rounded-md transition-all ";

        if (active) {
          if (item.accent === "red") {
            className += "font-semibold text-red-300 bg-red-500/10";
          } else if (item.accent === "purple") {
            className += "font-semibold text-purple-300 bg-purple-500/10";
          } else {
            className += "font-semibold text-white bg-dark-600";
          }
        } else {
          if (item.accent === "red") {
            className += "font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10";
          } else if (item.accent === "purple") {
            className += "text-slate-400 hover:text-purple-300 hover:bg-purple-500/10";
          } else {
            className += "text-slate-400 hover:text-white hover:bg-dark-600";
          }
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
