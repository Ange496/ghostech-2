
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiArrowRight,
  FiArrowUp,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const ORANGE = "#fd800a";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://lnkd.in/edXVXbH8",
    icon: FaLinkedinIn,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ghostech00",
    icon: FaTiktok,
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/Le6R6EvCKOR8I3kmQEd9XS",
    icon: FaWhatsapp,
  },
];

const QUICK_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Événements", href: "/evenements/hackathons" },
  { label: "Formations", href: "/formation" },
  { label: "Nos pôles", href: "/poles/numerique" },
  { label: "Nos projets", href: "/projets/impact" },
  { label: "Contact", href: "/contact" },
  { label: "Devenir membre", href: "/equipe/rejoindre" },
];

export default function Footer() {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/devarena")
  ) {
    return null;
  }

  const whatsappLink =
    "https://chat.whatsapp.com/Le6R6EvCKOR8I3kmQEd9XS";

  const handleNewsletter = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Aucun abonnement ne doit être annoncé avant
    // la connexion effective à un service newsletter.
    setNewsletterMessage(
      "Les inscriptions à la newsletter ne sont pas encore activées."
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-[#090909] text-white">
      {/* Décoration d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 left-1/2 -z-10
          h-[420px] w-[720px] -translate-x-1/2 rounded-full
          bg-[#fd800a]/[0.08] blur-[110px]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Bandeau principal */}
        <div className="grid gap-10 border-b border-white/10 py-12 md:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Identité Ghostech */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              aria-label="Ghostech - Accueil"
              className="inline-flex rounded-lg outline-none
                focus-visible:ring-2 focus-visible:ring-[#fd800a]"
            >
              <Image
                src="/logo1.svg"
                alt="Ghostech"
                width={200}
                height={70}
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>

            <div className="mt-6 flex items-center gap-3">
              
              <span className="text-[10px] font-bold uppercase
                tracking-[0.25em] text-[#fd800a]">
                Construire. Impacter. Conquérir.
              </span>
            </div>

            <h2 className="mt-4 max-w-lg text-2xl font-bold
              leading-tight tracking-tight sm:text-3xl">
              La technologie au service des talents africains.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
              Ghostech est une organisation panafricaine engagée
              dans le développement des compétences numériques,
              l'innovation et l'entrepreneuriat technologique en Afrique.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              La tech, pour tous, en Afrique.
            </p>
          </div>

          {/* Newsletter */}
          <div className="relative overflow-hidden rounded-2xl
            border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12
                h-40 w-40 rounded-full bg-[#fd800a]/10 blur-3xl"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2
                rounded-full border border-[#fd800a]/30
                bg-[#fd800a]/10 px-3 py-1.5 text-[10px]
                font-bold uppercase tracking-[0.2em] text-[#fd800a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fd800a]" />
                Restons connectés
              </span>

              <h3 className="mt-5 text-xl font-bold sm:text-2xl">
                L'actualité de la tech, directement chez vous.
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Retrouvez nos événements, formations, projets
                et opportunités pour les talents du numérique.
              </p>

              <form
                onSubmit={handleNewsletter}
                className="mt-6"
              >
                <label
                  htmlFor="footer-newsletter-email"
                  className="mb-2 block text-xs font-semibold text-zinc-300"
                >
                  Votre adresse e-mail
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center
                    gap-3 rounded-xl border border-white/10
                    bg-black/40 px-4 transition-colors
                    focus-within:border-[#fd800a]/70">
                    <FiMail className="h-4 w-4 shrink-0 text-zinc-500" />

                    <input
                      id="footer-newsletter-email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setNewsletterMessage("");
                      }}
                      required
                      className="min-w-0 flex-1 bg-transparent
                        py-3.5 text-sm text-white outline-none
                        placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center
                      gap-2 rounded-xl bg-[#fd800a] px-5 py-3.5
                      text-sm font-bold text-white transition-all
                      hover:bg-[#e87100] active:scale-[0.98]"
                  >
                    S'inscrire
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {newsletterMessage && (
                  <p
                    role="status"
                    className="mt-3 text-xs leading-5 text-orange-300"
                  >
                    {newsletterMessage}
                  </p>
                )}

                <p className="mt-3 text-[11px] leading-5 text-zinc-500">
                  Votre adresse sera utilisée conformément à notre
                  politique de confidentialité lorsque le service sera activé.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation et contact */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Liens rapides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
              Navigation
            </h3>

            <div className="mb-5 mt-3 h-[2px] w-8 bg-[#fd800a]" />

            <ul className="space-y-3">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2
                      text-sm text-zinc-400 transition-colors
                      hover:text-[#fd800a]"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-700
                      transition-colors group-hover:bg-[#fd800a]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
              Suivez-nous
            </h3>

            <div className="mb-5 mt-3 h-[2px] w-8 bg-[#fd800a]" />

            <p className="max-w-xs text-sm leading-6 text-zinc-400">
              Rejoignez notre réseau et suivez les initiatives
              de Ghostech dans l'écosystème numérique.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ghostech sur ${social.label}`}
                    className="flex h-11 w-11 items-center justify-center
                      rounded-xl border border-white/10 bg-white/[0.04]
                      text-zinc-400 transition-all duration-200
                      hover:-translate-y-1 hover:border-[#fd800a]/40
                      hover:bg-[#fd800a]/10 hover:text-[#fd800a]"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Coordonnées */}
          <div className="sm:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
              Contact
            </h3>

            <div className="mb-5 mt-3 h-[2px] w-8 bg-[#fd800a]" />

            <div className="grid gap-5 sm:grid-cols-2">
              <a
                href="mailto:ghostech92@gmail.com"
                className="group flex items-start gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center
                  justify-center rounded-xl border border-white/10
                  bg-white/[0.04] text-[#fd800a] transition-colors
                  group-hover:border-[#fd800a]/40">
                  <FiMail className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs text-zinc-500">
                    E-mail
                  </span>
                  <span className="mt-1 block break-all text-sm
                    text-zinc-300 transition-colors
                    group-hover:text-[#fd800a]">
                    ghostech92@gmail.com
                  </span>
                </span>
              </a>

              <a
                href="tel:+2250556130245"
                className="group flex items-start gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center
                  justify-center rounded-xl border border-white/10
                  bg-white/[0.04] text-[#fd800a] transition-colors
                  group-hover:border-[#fd800a]/40">
                  <FiPhone className="h-4 w-4" />
                </span>

                <span>
                  <span className="block text-xs text-zinc-500">
                    Téléphone
                  </span>
                  <span className="mt-1 block text-sm text-zinc-300
                    transition-colors group-hover:text-[#fd800a]">
                    +225 05 56 13 02 45
                  </span>
                </span>
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 sm:col-span-2"
              >
                <span className="flex h-10 w-10 shrink-0 items-center
                  justify-center rounded-xl border border-white/10
                  bg-white/[0.04] text-[#fd800a] transition-colors
                  group-hover:border-[#fd800a]/40">
                  <FiMapPin className="h-4 w-4" />
                </span>

                <span>
                  <span className="block text-xs text-zinc-500">
                    Localisation et communauté
                  </span>
                  <span className="mt-1 block text-sm text-zinc-300
                    transition-colors group-hover:text-[#fd800a]">
                    Abidjan, Côte d'Ivoire · Nous contacter sur WhatsApp
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col gap-5 border-t border-white/10
          py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs leading-5 text-zinc-500 sm:text-left">
            © {new Date().getFullYear()} Ghostech. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href="/conditions-generales"
              className="text-xs text-zinc-400 transition-colors
                hover:text-[#fd800a]"
            >
              Conditions générales
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 rounded-full
                border border-white/10 px-4 py-2.5 text-xs font-semibold
                text-zinc-300 transition-all hover:border-[#fd800a]
                hover:bg-[#fd800a] hover:text-white"
              aria-label="Remonter en haut de la page"
            >
              Retour en haut
              <FiArrowUp className="h-4 w-4 transition-transform
                group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
