"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDES } from "@/src/fonctionnalites/accueil/donnees/hero-slides";
import { ArrowRight, Monitor, Code, ShieldCheck, BrainCircuit } from "lucide-react";

const SLIDE_INTERVAL_MS = 3000;
const FALLBACK_IMAGE = "/header_photo/4KK.png";
const MOBILE_IMAGE = "/header_photo/4k_mobile.png";

const SERVICES = [
  { Icon: Monitor,     label: "Web & Mobile",    highlighted: false },
  { Icon: ShieldCheck, label: "Cyber-sécurité",  highlighted: false },
  { Icon: Code,        label: "Réseaux & Cloud", highlighted: false },
  { Icon: BrainCircuit,label: "IA & Robotique",  highlighted: true  },
] as const;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesCount = HERO_SLIDES.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (slidesCount === 0) return;
      setActiveIndex(((index % slidesCount) + slidesCount) % slidesCount);
    },
    [slidesCount]
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  // Auto-play avec pause au survol + respect de prefers-reduced-motion
  useEffect(() => {
    if (slidesCount <= 1 || isPaused) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [nextSlide, slidesCount, isPaused]);

  const currentSlide = HERO_SLIDES[activeIndex];
  const heroImage = currentSlide?.image ?? FALLBACK_IMAGE;
  const mobileHeroImage = currentSlide?.image ?? MOBILE_IMAGE;

  return (
    <section className="relative w-full mx-auto mt-0 px-0 mb-0">
      <div
        className="relative isolate w-full overflow-hidden rounded-none border-0 border-white bg-[#24170f] px-4 pt-12 pb-10 sm:rounded-[2.5rem] sm:border-[18px] sm:px-12 md:pt-16 md:pb-14"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <style jsx>{`
          @keyframes hero-mobile-slide {
            0% {
              transform: translateX(18px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>

        {/* ================= IMAGE DE FOND ================= */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Image mobile */}
          <Image
            key={`mobile-${activeIndex}`}
            src={mobileHeroImage}
            alt=""
            fill
            priority
            sizes="(max-width: 639px) 100vw, 0px"
            className="object-cover object-center opacity-100 sm:hidden motion-safe:animate-[hero-mobile-slide_700ms_ease-out]"
            aria-hidden="true"
          />
          {/* Image desktop avec transition en fondu */}
          <Image
            key={`desktop-${activeIndex}`}
            src={heroImage}
            alt="La technologie au service des talents africains"
            fill
            priority
            sizes="(min-width: 640px) 100vw, 0px"
            className="hidden object-cover object-center opacity-100 transition-opacity duration-700 ease-out sm:block"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-black/60" />
        </div>

        {/* ================= CONTENU PRINCIPAL ================= */}
        <div className="relative z-10 flex min-h-[460px] w-full flex-col items-end justify-between gap-8 pt-16 pb-4 sm:pt-20 md:pt-80 lg:min-h-[520px] lg:flex-row">
          {/* -------- Côté Gauche : Titre + description -------- */}
          <div className="z-10 flex w-full flex-col items-start justify-end lg:w-[50%]">
            <h1 className="font-b612 mb-3 text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Construire. <span className="text-white">Impacter.</span>{" "}
              <span className="text-[#fd800a]">Conquérir.</span>
            </h1>

            <p className="mb-5 max-w-[520px] text-xs font-normal leading-relaxed text-white/90 sm:text-sm md:text-base">
              La tech, pour tous, en Afrique. Développer les talents, construire
              des solutions concrètes et façonner l&apos;avenir numérique du
              continent.
            </p>
          </div>

          {/* -------- Côté Droit : Services + Carte -------- */}
          <div className="z-10 flex w-full flex-col items-start justify-end gap-5 lg:w-[48%] lg:items-end lg:self-stretch">
            {/* Services */}
            <div className="flex w-full flex-col items-start lg:items-end">
              <span className="mb-2.5 text-xs font-bold text-white drop-shadow-md sm:text-sm">
                GHOSTECH · 7 Pôles d&apos;Excellence
              </span>

              <ul className="grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3">
                {SERVICES.map(({ Icon, label, highlighted }) => (
                  <li
                    key={label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <button
                      type="button"
                      aria-label={label}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-md backdrop-blur-md transition-colors sm:h-14 sm:w-14 ${
                        highlighted
                          ? "bg-[#fd800a] text-white shadow-lg hover:brightness-90"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </button>
                    <span className="text-[10px] font-medium leading-tight text-white/90 drop-shadow sm:text-[11px]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Carte "Construire ensemble" */}
            <div className="relative flex w-full max-w-full flex-row items-center justify-between gap-3 self-stretch overflow-hidden rounded-2xl bg-white p-4 text-zinc-900 shadow-2xl sm:max-w-[380px] sm:overflow-visible sm:p-5 lg:self-end">
              <div className="z-10 flex w-[68%] flex-col items-start sm:w-[65%]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#fd800a]">
                  Impact Collectif
                </span>
                <h4 className="text-sm font-extrabold leading-snug tracking-tight text-zinc-900 sm:text-base">
                  Construire ensemble
                </h4>
                <p className="mb-3 mt-1 text-[10px] leading-snug text-zinc-500 sm:text-[11px]">
                  Former, connecter et accompagner les talents pour transformer
                  les idées en solutions à fort impact.
                </p>

                <Link
                  href="/equipe/rejoindre"
                  className="group flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#fd800a] px-3 py-1.5 text-[10px] font-bold text-white shadow-md transition-all hover:bg-[#e56f00] sm:text-xs"
                >
                  <span className="whitespace-nowrap">Créer de l&apos;impact</span>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[#fd800a] transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                </Link>
              </div>

              {/* Avatar */}
              <div className="pointer-events-none absolute -bottom-2 -right-4 z-20 h-44 w-44 sm:-bottom-4 sm:-right-8 sm:h-56 sm:w-56">
                <Image
                  src="/header_photo/h.png"
                  alt="Talent technologique Ghostech"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= INDICATEURS DE SLIDE ================= */}
        {slidesCount > 1 && (
          <div
            className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Navigation du carrousel"
          >
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Aller au slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-6 bg-[#fd800a]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}