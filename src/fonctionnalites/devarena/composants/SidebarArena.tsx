"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/src/composants/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/src/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { userService } from "@/src/services/userService";

// ── Icône chevron ──────────────────────────────────────────────────────────────
const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ── Profil par défaut si pas de session ───────────────────────────────────────
const DEFAULT_USER = {
  name: "Utilisateur",
  email: "user@ghostech.dev",
  avatar: "https://i.pravatar.cc/150?u=ghostech",
};

// ── Composant principal ───────────────────────────────────────────────────────
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const [openDuo, setOpenDuo] = useState(
    pathname.startsWith("/devarena/duo")
  );
  const [openClassement, setOpenClassement] = useState(
    pathname.startsWith("/devarena/classement")
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // First set basic info from auth
        setUser({
          name: currentUser.displayName || "Utilisateur",
          email: currentUser.email || "",
          avatar: currentUser.photoURL || "https://i.pravatar.cc/150?u=ghostech",
        });

        // Then try to fetch detailed info from Firestore
        try {
          const data = await userService.getUser(currentUser.uid);
          if (data) {
            setUser({
              name: data.name || currentUser.displayName || "Utilisateur",
              email: data.email || currentUser.email || "",
              avatar: data.avatarUrl || currentUser.photoURL || "https://i.pravatar.cc/150?u=ghostech",
            });
          }
        } catch (err) {
          console.error("Error fetching user profile in sidebar:", err);
        }
      } else {
        setUser(DEFAULT_USER);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    if (!auth) {
      localStorage.removeItem("ghostech_user");
      router.push("/login");
      return;
    }

    try {
      await signOut(auth);
      localStorage.removeItem("ghostech_user");
      router.push("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // ── Classes helper ───────────────────────────────────────────────────────────
  const linkClass = (href: string) =>
    `flex items-center gap-3 px-5 py-3 rounded-full transition-all font-medium text-sm my-1 ${pathname === href
      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const accordionClass = (prefix: string) =>
    `w-full flex items-center justify-between gap-3 px-5 py-3 rounded-full transition-all font-medium text-sm my-1 ${pathname.startsWith(prefix)
      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const subLinkClass = (href: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm ${pathname === href
      ? "bg-teal-50 text-teal-700 font-bold"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
    }`;

  // ── JSX ──────────────────────────────────────────────────────────────────────
  return (
    <Sidebar side="left" className="border-r border-gray-100 text-gray-800 [&>[data-sidebar=sidebar]]:bg-white bg-white">

      {/* ── Header ── */}
      <SidebarHeader className="px-6 py-8 border-b-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            ghostech<span className="text-teal-600">.</span>
          </h2>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-4 py-2 flex-1 overflow-y-auto">
        <SidebarGroup className="space-y-0.5 flex flex-col">

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 mb-2 mt-4">Menu</div>

          {/* 1 — Actualités (PREMIER) */}
          <Link href="/devarena/actualites" className={linkClass("/devarena/actualites")}>
            <span className="material-symbols-rounded text-[20px]">dashboard</span>
            Dashboard
          </Link>

          {/* 2 — Duo + sous-menus */}
          <div>
            <button
              onClick={() => setOpenDuo(!openDuo)}
              className={accordionClass("/devarena/duo")}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[20px]">sports_esports</span>
                Duo
              </span>
              <ChevronDown open={openDuo} />
            </button>
            {openDuo && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 py-2">
                <Link href="/devarena/duo" className={subLinkClass("/devarena/duo")}>
                  Tous les matchs
                </Link>
                <Link href="/devarena/duo/vague1" className={subLinkClass("/devarena/duo/vague1")}>
                  🌊 Vague 1
                </Link>
                <Link href="/devarena/duo/vague2" className={subLinkClass("/devarena/duo/vague2")}>
                  🌊 Vague 2
                </Link>
                <Link href="/devarena/duo/vague3" className={subLinkClass("/devarena/duo/vague3")}>
                  🌊 Vague 3
                </Link>
              </div>
            )}
          </div>

          {/* 3 — Classement + sous-menus */}
          <div>
            <button
              onClick={() => setOpenClassement(!openClassement)}
              className={accordionClass("/devarena/classement")}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[20px]">leaderboard</span>
                Classement
              </span>
              <ChevronDown open={openClassement} />
            </button>
            {openClassement && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 py-2">
                <Link href="/devarena/classement" className={subLinkClass("/devarena/classement")}>
                  Global
                </Link>
                <Link href="/devarena/classement/vague1" className={subLinkClass("/devarena/classement/vague1")}>
                  🌊 Vague 1
                </Link>
                <Link href="/devarena/classement/vague2" className={subLinkClass("/devarena/classement/vague2")}>
                  🌊 Vague 2
                </Link>
                <Link href="/devarena/classement/vague3" className={subLinkClass("/devarena/classement/vague3")}>
                  🌊 Vague 3
                </Link>
              </div>
            )}
          </div>

          {/* 4 — Projets */}
          <Link href="/devarena/projets" className={linkClass("/devarena/projets")}>
            <span className="material-symbols-rounded text-[20px]">folder_special</span>
            Projets
          </Link>

          {/* 5 — Règlement (DERNIER) */}
          <Link href="/devarena/reglement" className={linkClass("/devarena/reglement")}>
            <span className="material-symbols-rounded text-[20px]">menu_book</span>
            Règlement
          </Link>

        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer : Profil utilisateur style ChatGPT ── */}
      <SidebarFooter className="p-3 bg-white border-t border-gray-100">
        <div className="relative" ref={profileRef}>
          {/* Popup style ChatGPT */}
          {profileOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200/80 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Infos utilisateur */}
              <div className="px-3 py-2.5">
                <p className="font-bold text-gray-900 text-[13px] truncate leading-none">{user.name}</p>
                <p className="text-[11px] text-gray-400 truncate mt-1 leading-none">{user.email}</p>
              </div>

              <div className="h-px bg-gray-100 my-1" />

              {/* Actions */}
              <div className="space-y-0.5">
                <Link
                  href="/profil"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all text-[13px] font-medium"
                >
                  <span className="material-symbols-rounded text-gray-400 text-[18px]">person</span>
                  Mon Profil
                </Link>

                <div className="h-px bg-gray-100 my-1" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all text-[13px] font-semibold"
                >
                  <span className="material-symbols-rounded text-red-500 text-[18px]">logout</span>
                  Se déconnecter
                </button>
              </div>
            </div>
          )}

          {/* Bouton profil style ChatGPT */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-gray-50 ${profileOpen ? "bg-gray-50" : ""
              }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-[13px] text-gray-900 truncate leading-tight">{user.name}</p>
            </div>
            <span className="material-symbols-rounded text-gray-400 text-[20px] shrink-0">more_horiz</span>
          </button>

        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
