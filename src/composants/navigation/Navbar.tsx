
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaFacebookF,
} from "react-icons/fa";
import {
  FiHome,
  FiCalendar,
  FiGrid,
  FiMail,
  FiUserPlus,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
  FiArrowUpRight,
} from "react-icons/fi";

import { auth } from "@/src/services/firebase";
import { useScroll } from "@/src/hooks/useScroll";

const ORANGE = "#fd800a";

const NAV_LINKS = [
  { label: "Accueil", href: "/", icon: FiHome, exact: true },
  {
    label: "Événements",
    href: "/evenements/hackathons",
    icon: FiCalendar,
    prefix: "/evenements",
  },
  {
    label: "Formations",
    href: "/formation",
    icon: FiCalendar,
    prefix: "/formation",
  },
  {
    label: "Pôles",
    href: "/poles/numerique",
    icon: FiGrid,
    prefix: "/poles",
  },
  {
    label: "Impact",
    href: "/projets/impact",
    icon: FiGrid,
    prefix: "/projets",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: FiMail,
    exact: true,
  },
  {
    label: "Devenir membre",
    href: "/equipe/rejoindre",
    icon: FiUserPlus,
    exact: true,
  },
];

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://lnkd.in/edXVXbH8",
    icon: FaLinkedinIn,
    hover: "hover:text-[#0077b5]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ghostech00",
    icon: FaTiktok,
    hover: "hover:text-black",
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/Le6R6EvCKOR8I3kmQEd9XS",
    icon: FaWhatsapp,
    hover: "hover:text-[#25D366]",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
    hover: "hover:text-[#1877F2]",
  },
];

function isActivePath(
  pathname: string,
  item: (typeof NAV_LINKS)[number]
) {
  if (item.exact) return pathname === item.href;

  return pathname.startsWith(item.prefix ?? item.href);
}

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScroll(20);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isHome = pathname === "/";
  const isHiddenRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/devarena");

  const solidHeader = !isHome || scrolled;

  // Synchronisation avec Firebase
  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
      },
      (error) => {
        console.error("Erreur de synchronisation Firebase :", error);
        setAuthReady(true);
      }
    );

    return unsubscribe;
  }, []);

  // Bloquer le défilement et fermer avec Escape
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Fermer le menu lors d'un changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isHiddenRoute) return null;

  const handleLogout = async () => {
    if (!auth || loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut(auth);
      setUser(null);
      setOpen(false);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const desktopLinkClass = (active: boolean) =>
    `relative inline-flex items-center rounded-full px-3 py-2
    text-[13px] lg:text-sm transition-colors duration-200
    ${
      active
        ? solidHeader
          ? "bg-orange-50 font-bold text-[#fd800a]"
          : "bg-white/15 font-bold text-white"
        : solidHeader
          ? "font-medium text-gray-600 hover:bg-gray-100 hover:text-[#fd800a]"
          : "font-medium text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  const logoSrc = solidHeader ? "/logo1_1.svg" : "/logo1.svg";

  return (
    <>
      {/* NAVIGATION PRINCIPALE */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b
          transition-[background-color,border-color,box-shadow] duration-300
          ${
            solidHeader
              ? "border-gray-200/80 bg-white/95 text-gray-900 shadow-sm backdrop-blur-xl"
              : "border-transparent bg-transparent text-white"
          }`}
      >
        <nav
          className={`mx-auto flex w-full max-w-7xl items-center
            justify-between gap-3 px-4 sm:px-6 lg:px-8
            transition-[height] duration-300
            ${scrolled ? "h-14 md:h-16" : isHome ? "h-18 md:h-20" : "h-16"}`}
          aria-label="Navigation principale"
        >
          {/* LOGO */}
          <Link
            href="/"
            className="group flex shrink-0 items-center rounded-lg
              outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a]"
            aria-label="Ghostech, accueil"
          >
            <Image
              src={logoSrc}
              alt="Ghostech"
              width={180}
              height={60}
              priority
              className={`w-auto object-contain transition-all duration-300
                ${scrolled ? "h-8 md:h-9" : isHome ? "h-10 sm:h-12 md:h-14" : "h-9 sm:h-10 md:h-11"}`}
            />
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden items-center justify-center gap-1 md:flex lg:gap-1.5">
            {NAV_LINKS.map((item) => {
              const active = isActivePath(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Connexion / profil desktop */}
            <Link
              href={user ? "/profil" : "/login"}
              className={`hidden items-center justify-center gap-2
                rounded-xl border px-4 py-2 text-xs font-bold
                transition-all duration-200 hover:-translate-y-0.5
                md:inline-flex lg:text-sm
                ${
                  solidHeader
                    ? "border-gray-200 bg-white text-gray-800 shadow-sm hover:border-[#fd800a]/40 hover:text-[#fd800a]"
                    : "border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20"
                }`}
            >
              {user ? (
                <>
                  <FiUser className="h-4 w-4" />
                  Mon profil
                </>
              ) : (
                <>
                  Se connecter
                  <FiArrowUpRight className="h-4 w-4" />
                </>
              )}
            </Link>

            {/* Profil rapide mobile */}
            {user && (
              <Link
                href="/profil"
                aria-label="Mon profil"
                className={`flex h-10 w-10 items-center justify-center
                  rounded-xl border transition-colors md:hidden
                  ${
                    solidHeader
                      ? "border-orange-200 bg-orange-50 text-[#fd800a]"
                      : "border-white/30 bg-white/10 text-white"
                  }`}
              >
                <FiUser className="h-5 w-5" />
              </Link>
            )}

            {/* BURGER */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className={`flex h-10 w-10 items-center justify-center
                rounded-xl transition-colors active:scale-95 md:hidden
                ${
                  solidHeader
                    ? "text-gray-900 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="ghostech-mobile-menu"
            >
              {open ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* MENU MOBILE */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Fond assombri */}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Fermer le menu de navigation"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 h-full w-full bg-black/50
            backdrop-blur-sm transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}`}
        />

        {/* Panneau coulissant */}
        <aside
          id="ghostech-mobile-menu"
          className={`absolute inset-y-0 right-0 flex w-[86%]
            max-w-[360px] flex-col border-l border-gray-100
            bg-white text-gray-900 shadow-2xl
            transition-transform duration-300 ease-out
            ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* En-tête du panneau */}
          <div className="flex h-[72px] shrink-0 items-center
            justify-between border-b border-gray-100 px-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Ghostech, accueil"
            >
              <Image
                src="/logo1_1.svg"
                alt="Ghostech"
                width={150}
                height={50}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center
                rounded-full bg-gray-100 text-gray-700
                transition-colors hover:bg-orange-50 hover:text-[#fd800a]"
              aria-label="Fermer le menu"
              tabIndex={open ? 0 : -1}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Liens de navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase
              tracking-[0.22em] text-gray-400">
              Explorer Ghostech
            </p>

            <div className="space-y-1.5">
              {NAV_LINKS.map((item) => {
                const active = isActivePath(pathname, item);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between
                      rounded-xl border px-4 py-3.5 text-sm
                      transition-all duration-200
                      ${
                        active
                          ? "border-orange-200 bg-orange-50 font-bold text-[#fd800a]"
                          : "border-transparent font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                      }`}
                  >
                    <span className="flex items-center gap-3.5">
                      <Icon
                        className={`h-5 w-5 ${
                          active
                            ? "text-[#fd800a]"
                            : "text-gray-400 group-hover:text-gray-700"
                        }`}
                      />
                      {item.label}
                    </span>

                    {active && (
                      <span
                        className="h-2 w-2 rounded-full bg-[#fd800a]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Signature */}
            <div className="mt-8 rounded-2xl border border-orange-100
              bg-gradient-to-br from-orange-50 to-white p-5">
              <div className="mb-2 h-1 w-10 rounded-full bg-[#fd800a]" />
              <p className="text-sm font-extrabold text-gray-900">
                La tech, pour tous, en Afrique.
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Construire des compétences, encourager l’innovation
                et accompagner les talents numériques africains.
              </p>
            </div>
          </div>

          {/* Bas du panneau */}
          <div className="shrink-0 space-y-4 border-t border-gray-100
            bg-gray-50/80 p-5">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex w-full items-center justify-center
                    gap-2 rounded-xl bg-[#fd800a] px-4 py-3
                    text-sm font-bold text-white shadow-md
                    shadow-orange-500/20 transition-colors
                    hover:bg-[#e87100]"
                >
                  <FiUser className="h-4 w-4" />
                  Mon profil
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut || !authReady}
                  tabIndex={open ? 0 : -1}
                  className="flex w-full items-center justify-center
                    gap-2 rounded-xl px-4 py-2.5 text-sm
                    font-semibold text-rose-600 transition-colors
                    hover:bg-rose-50 disabled:cursor-not-allowed
                    disabled:opacity-50"
                >
                  <FiLogOut className="h-4 w-4" />
                  {loggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex w-full items-center justify-center
                  gap-2 rounded-xl bg-[#fd800a] px-4 py-3
                  text-sm font-bold text-white shadow-md
                  shadow-orange-500/20 transition-all
                  hover:bg-[#e87100] active:scale-[0.98]"
              >
                <FiLogIn className="h-4 w-4" />
                Se connecter
              </Link>
            )}

            {/* Réseaux sociaux */}
            <div className="border-t border-gray-200/70 pt-4">
              <p className="mb-3 text-center text-[10px] font-bold
                uppercase tracking-[0.2em] text-gray-400">
                Suivez Ghostech
              </p>

              <div className="flex items-center justify-center gap-5">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ghostech sur ${social.label}`}
                      tabIndex={open ? 0 : -1}
                      className={`flex h-10 w-10 items-center
                        justify-center rounded-xl bg-white
                        text-gray-500 shadow-sm ring-1 ring-gray-200/70
                        transition-colors ${social.hover}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-400">
              Ghostech · Construire. Impacter. Conquérir.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
