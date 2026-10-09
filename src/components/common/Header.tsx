"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCareFlow } from "@/context/CareFlowContext";
import {
  Globe, ChevronDown,
  Bell,
  User,
  Menu,
  X,
  Activity,
  Smartphone,
  Play,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { appLanguage, setAppLanguage } = useCareFlow();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const langMap: Record<string, string> = { "English": "en", "Hindi": "hi", "Bengali": "bn", "Marathi": "mr", "Gujarati": "gu", "Punjabi": "pa", "Odia": "or", "Assamese": "as", "Kashmiri": "ks" };
  const languages = Object.keys(langMap);

  React.useEffect(() => {
    const saved = localStorage.getItem("careflow_lang");
    if (saved && langMap[saved]) {
      setAppLanguage(saved);
    }
  }, [setAppLanguage]);
  
  const handleTranslate = (lang: string) => {
    setAppLanguage(lang);
    localStorage.setItem("careflow_lang", lang);
    setShowLangMenu(false);
    
    // Google Translate Cookie Hack
    const code = langMap[lang];
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#sarthiai", label: "SarthiAi" },
    { href: "/prescription", label: "Prescription AI" },
    { href: "/discovery", label: "Doctors" },
    { href: "/hospital", label: "Hospitals" },
    { href: "/emergency", label: "Ambulance" },
    { href: "/guidelines", label: "Trust & Safety" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Image src="/logo.jpg" alt="ArogyaGrid Logo" fill className="object-cover scale-[1.15]" priority />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight leading-none">
                ArogyaGrid
              </h1>
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
            {/* App Link */}
            <button
              onClick={() => setShowQR(true)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2 flex items-center gap-1"
            >
              <Smartphone className="w-4 h-4" /> App
            </button>
          </nav>

          {/* Icons & Actions (Right) */}
          <div className="hidden lg:flex items-center gap-5 text-slate-400">
            {/* Demo Button */}
            <Link
              href="/emergency"
              className="px-4 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Demo
            </Link>

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md"
                  title="Translate Page"
                >
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold uppercase">{appLanguage.substring(0,3)}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 w-32 z-50">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleTranslate(lang)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 ${appLanguage === lang ? "text-cyan-400 font-bold" : "text-slate-300"}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            <button className="hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <Link href="/login" className="w-8 h-8 rounded-full bg-[#1F2833] border border-white/10 flex items-center justify-center hover:border-cyan-400/50 hover:bg-[#2A3645] transition-colors" title="Login / Sign up">
              <User className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
            <button
              onClick={() => {
                setShowQR(true);
                setMobileMenuOpen(false);
              }}
              className="text-base font-medium py-2 text-slate-400 text-left flex items-center gap-2"
            >
              <Smartphone className="w-5 h-5" /> Download App
            </button>
            <div className="h-[1px] bg-white/5 my-2"></div>
            <div className="flex gap-6 text-slate-400 pb-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <Bell className="w-5 h-5" />
              <Link href="/login" className="hover:text-white transition-colors" title="Login / Sign up"><User className="w-5 h-5" /></Link>
            </div>
          </div>
        )}
      </header>

      {/* QR Code Modal for App */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          ></div>
          <div className="relative bg-[#11131A] border border-white/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Get ArogyaGrid
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Scan with your phone to install the Android app.
            </p>

            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://mp-online-healthcare-app.vercel.app/ArogyaGrid.apk`}
                alt="Download APK"
                className="w-48 h-48"
              />
            </div>

            <a
              href="/ArogyaGrid.apk"
              download
              className="block w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              Download .APK
            </a>
          </div>
        </div>
      )}
    </>
  );
}





