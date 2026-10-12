"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { 
  Users, 
  CalendarDays,
  LayoutDashboard,
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { auth } from "@/src/services/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    if (!auth) return;
    setSignOutError("");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Unable to sign out from the dashboard:", error);
      setSignOutError("La déconnexion a échoué. Réessayez.");
    }
  };

  interface NavItem {
    href: string;
    icon: React.ReactNode;
    label: string;
    subItems?: { href: string; label: string }[];
  }

  const navItems: NavItem[] = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Vue d'ensemble" },
    { href: "/dashboard/membres", icon: <Users size={20} />, label: "Membres" },
    { href: "/dashboard/evenements", icon: <CalendarDays size={20} />, label: "Événements" }
  ];

  return (
    <div className="flex min-h-dvh overflow-hidden bg-[#111210] font-sans text-stone-100">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed z-50 flex h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#171816] lg:relative"
      >
        <div>
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fd800a] text-sm font-black text-white">G</div>
              <span className="text-lg font-bold tracking-wider text-white">GHOSTECH</span>
            </Link>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="mt-4 space-y-2 p-4">
            {navItems.map((item) => {
              const isParentActive = item.href === "/dashboard" 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="space-y-1">
                  <Link href={item.href} onClick={() => isMobile && !item.subItems && setSidebarOpen(false)}>
                    <div className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
                      isParentActive 
                          ? "border border-white/10 bg-[#fd800a] font-bold text-white" 
                          : "text-stone-500 hover:bg-white/5 hover:text-white font-medium"
                    }`}>
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {isParentActive && !item.subItems && <ChevronRight size={16} />}
                    </div>
                  </Link>

                  {/* Render sub-items if parent is active and has sub-items */}
                  {item.subItems && isParentActive && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link key={sub.href} href={sub.href} onClick={() => isMobile && setSidebarOpen(false)}>
                            <div className={`text-xs py-2 px-3 rounded-lg transition-all ${
                              isSubActive 
                                ? "bg-white/10 font-bold text-[#fd800a]" 
                                : "text-stone-500 hover:bg-white/5 hover:text-stone-200"
                            }`}>
                              • {sub.label}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-stone-500 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
            <LogOut size={20} />
            Déconnexion
          </button>
          {signOutError && <p className="mt-2 px-4 text-xs text-rose-400" role="alert">{signOutError}</p>}
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="min-w-0 flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#111210]/90 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fd800a] text-xs font-black text-white">G</div>
              <span className="text-sm font-bold tracking-wider text-white">GHOSTECH</span>
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-[#1b1c1a] px-4 py-2 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#fd800a]/40 md:flex">
              <Search size={16} className="text-stone-500" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-sm w-64 text-white placeholder-stone-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative text-stone-500 hover:text-white transition-colors" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#fd800a] rounded-full border-2 border-[#111210]"></span>
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/50 shadow-md shadow-indigo-500/20 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Admin" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-bold text-white leading-none">Admin Ghostech</p>
                <p className="text-[10px] text-[#fd800a] mt-1">Superviseur</p>
              </div>
            </div>

            {/* Menu burger mobile placé à droite */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-stone-300 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 lg:hidden ml-1"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.16); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(253, 128, 10, 0.6); }
      `}} />
    </div>
  );
}
