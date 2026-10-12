
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OBJECTIFS } from "@/src/fonctionnalites/accueil/donnees/objectifs";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SectionObjectifsProps {
  scrollY: number;
}

const CARTE_SUPPLÉMENTAIRE = {
  title: "Culture",
  desc: "Innovation, impact, collaboration, apprentissage, excellence et engagement africain guident notre action.",
};

const INTERVALLE_DEFILEMENT = 3200;

export default function SectionObjectifs({
  scrollY,
}: SectionObjectifsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseRef = useRef(false);

  const [isPaused, setIsPaused] = useState(false);

  const toutesLesCartes = [...OBJECTIFS, CARTE_SUPPLÉMENTAIRE];

  const scrollCards = useCallback((direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector<HTMLElement>(
      "[data-objectif-card]"
    );

    if (!firstCard) return;

    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;

    const maxScroll =
      carousel.scrollWidth - carousel.clientWidth;

    if (direction === 1 && carousel.scrollLeft >= maxScroll - 8) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && carousel.scrollLeft <= 8) {
      carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    carousel.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  }, []);

  const pauseAutoplay = () => {
    pauseRef.current = true;
    setIsPaused(true);
  };

  const resumeAutoplay = () => {
    pauseRef.current = false;
    setIsPaused(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const startAutoplay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (mediaQuery.matches) return;

      intervalRef.current = setInterval(() => {
        if (pauseRef.current) return;

        const firstCard =
          carousel.querySelector<HTMLElement>(
            "[data-objectif-card]"
          );

        if (!firstCard) return;

        const gap =
          Number.parseFloat(
            window.getComputedStyle(carousel).columnGap
          ) || 0;

        const distance =
          firstCard.getBoundingClientRect().width + gap;

        const maxScroll =
          carousel.scrollWidth - carousel.clientWidth;

        if (carousel.scrollLeft >= maxScroll - 8) {
          carousel.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          carousel.scrollBy({
            left: distance,
            behavior: "smooth",
          });
        }
      }, INTERVALLE_DEFILEMENT);
    };

    startAutoplay();
    mediaQuery.addEventListener("change", startAutoplay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      mediaQuery.removeEventListener("change", startAutoplay);
    };
  }, []);

  return (
    <section
      aria-labelledby="objectifs-heading"
      className="relative isolate w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* Décoration d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          transform: `translateY(${scrollY * 0.04}px)`,
          background:
            "radial-gradient(ellipse at 85% 15%, rgba(253,128,10,0.09), transparent 48%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        {/* En-tête */}
        <div className="flex flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-3xl">

            <h2
              id="objectifs-heading"
              className="font-b612 text-3xl font-black leading-[1.08] tracking-tight text-[#111111] sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Vision, mission & <span className="text-[#fd800a]">
                objectifs
              </span>

            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Développer les talents, stimuler l'innovation et
              accompagner la création de solutions technologiques
              à fort impact pour l'Afrique.
            </p>
          </div>

          {/* Navigation du carrousel */}
          <div className="flex items-center justify-between gap-5 lg:justify-end">
        
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Afficher le pilier précédent"
                onClick={() => scrollCards(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm transition duration-200 hover:border-[#fd800a] hover:text-[#fd800a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a] sm:h-12 sm:w-12"
              >
                <ChevronLeft size={21} />
              </button>

              <button
                type="button"
                aria-label="Afficher le pilier suivant"
                onClick={() => scrollCards(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fd800a] text-white shadow-md shadow-orange-200/60 transition duration-200 hover:-translate-y-0.5 hover:bg-[#e97000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a] focus-visible:ring-offset-2 sm:h-12 sm:w-12"
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>
        </div>

        {/* Carrousel */}
        <div
          className="relative"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocusCapture={pauseAutoplay}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node)
            ) {
              resumeAutoplay();
            }
          }}
          onTouchStart={pauseAutoplay}
          onTouchEnd={() => {
            window.setTimeout(resumeAutoplay, 1800);
          }}
        >
          <div
            ref={carouselRef}
            role="region"
            aria-label="Les piliers de Ghostech"
            aria-roledescription="carrousel"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-5 pt-2 sm:gap-5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {toutesLesCartes.map((obj, index) => {
              const isOrange = index === 0;
              const isDark = index === 2;

              const cardStyle = isOrange
                ? "bg-gradient-to-br from-[#fd800a] to-[#df6900] text-white border-transparent"
                : isDark
                  ? "bg-[#111111] text-white border-[#222222]"
                  : "border-zinc-200 bg-white text-[#111111]";

              return (
                <article
                  key={obj.title}
                  data-objectif-card
                  aria-label={`${obj.title}, pilier ${index + 1}`}
                  className={`group relative flex min-h-[300px] w-[84vw] max-w-[360px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] sm:min-h-[320px] sm:w-[320px] sm:p-7 lg:w-[340px] ${cardStyle}`}
                >
                  {/* Élément graphique décoratif */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border-[22px] transition duration-500 group-hover:scale-125 ${
                      isOrange
                        ? "border-white/10"
                        : isDark
                          ? "border-white/[0.04]"
                          : "border-orange-50"
                    }`}
                  />

                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                          isOrange || isDark
                            ? "text-white/65"
                            : "text-[#fd800a]"
                        }`}
                      >
                        Pilier {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-3xl font-black ${
                          isOrange || isDark
                            ? "text-white/[0.12]"
                            : "text-orange-100"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="max-w-[260px] text-2xl font-extrabold leading-tight tracking-tight sm:text-[26px]">
                      {obj.title}
                    </h3>
                  </div>

                  <div className="relative mt-8">
                    <p
                      className={`text-sm leading-7 ${
                        isOrange || isDark
                          ? "text-white/80"
                          : "text-zinc-600"
                      }`}
                    >
                      {obj.desc}
                    </p>

                    <div
                      className={`mt-6 flex items-center justify-between border-t pt-4 ${
                        isOrange || isDark
                          ? "border-white/15"
                          : "border-zinc-100"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[10px] ${
                          isOrange || isDark
                            ? "text-white/75"
                            : "text-zinc-500"
                        }`}
                      >
                        Construire l'impact
                      </span>

                      <span
                        aria-hidden="true"
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition duration-300 group-hover:rotate-45 ${
                          isOrange
                            ? "bg-white text-[#fd800a]"
                            : isDark
                              ? "bg-white text-[#111111]"
                              : "bg-[#111111] text-white"
                        }`}
                      >
                        <ArrowUpRight size={19} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Indicateur de lecture */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        

          <div
            className={`h-1 w-16 overflow-hidden rounded-full bg-orange-100 sm:w-24 ${
              isPaused ? "opacity-50" : ""
            }`}
          >
            <div
              className={`h-full rounded-full bg-[#fd800a] ${
                isPaused ? "w-1/3" : "w-full"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
