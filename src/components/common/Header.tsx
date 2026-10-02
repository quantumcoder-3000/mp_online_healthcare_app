"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Bell, User, Menu, X, Activity } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/prescription", label: "Prescription AI" },
    { href: "/discovery", label: "Doctors" },
    { href: "/hospital", label: "Hospitals" },
    { href: "/guidelines", label: "Trust & Safety" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0C10] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Left) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#1F2833] border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-none">ArogyaGrid</h1>
            <span className="text-xs text-slate-400">powered by AI</span>
          </div>
        </Link>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Icons (Right) */}
        <div className="hidden lg:flex items-center gap-5 text-slate-400">
          <button className="hover:text-white transition-colors">
            <Moon className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute 0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <button className="w-8 h-8 rounded-full bg-[#1F2833] border border-white/10 flex items-center justify-center hover:border-cyan-400/50 transition-colors">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-slate-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0B0C10] border-b border-white/5 shadow-2xl py-4 px-6 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium py-2 ${
                pathname === href ? "text-cyan-400" : "text-slate-400"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="h-[1px] bg-white/5 my-2"></div>
          <div className="flex gap-6 text-slate-400 pb-2">
            <Moon className="w-5 h-5" />
            <Bell className="w-5 h-5" />
            <User className="w-5 h-5" />
          </div>
        </div>
      )}
    </header>
  );
}