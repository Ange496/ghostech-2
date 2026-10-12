
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  X,
  GraduationCap,
  Code2,
  Lightbulb,
  Users,
  Rocket,
  BookOpen,
  CalendarDays,
  Play,
} from "lucide-react";

type SlideMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "youtube"; videoId: string; alt: string; thumbnail?: string };

type Slide = {
  title: string;
  category: string;
  description: string;
  media: SlideMedia;
  icon: typeof GraduationCap;
};

const SLIDES: Slide[] = [
{
    title: "G-TECH SUMMIT 2026",
    category: "Evenement",
    description:
      "Explorez les dernières tendances, rencontrez des experts et progressez à votre rythme dans un environnement inspirant.",
    icon: BookOpen,
    media: {
      type: "image",
      src: "/Galeries/GTECH.jpeg",
      alt: "Ressources et apprentissage numérique",
    },
  },
  {
    title: "Atelier de Formation #3",
    category: "TRANSMISSION",
    description:
      "Rencontrez des experts, découvrez de nouvelles perspectives et apprenez auprès de professionnels.",
    icon: Users,
    media: {
      type: "video",
      src: "/video/v1.mp4",
      poster: "/Galeries/Haka/haka1.png",
      alt: "Conférence et partage d'expérience",
    },
  },
  {
    title: "Atelier de Formation #1",
    category: "PRATIQUE",
    description:
      "Expérimentez, collaborez et transformez vos connaissances en compétences concrètes.",
    icon: Code2,
    media: {
      type: "youtube",
      videoId: "nT4KbtG11sA",
      alt: "Activités et initiatives technologiques de Ghostech",
    },
  },
  {
    title: "Hackathons #1",
    category: "INNOVATION",
    description:
      "Relevez des défis technologiques et imaginez des solutions aux enjeux africains autour du smartwattiua.",
    icon: Lightbulb,
    media: {
      type: "image",
      src: "/Galeries/Haka/haka6.png",
      alt: "Projet collaboratif et innovation technologique",
    },
  },
  {
    title: "Atelier de Formation #2",
    category: "RENCONTRES",
    description:
      "Découvrez des échanges inspirants avec les talents, les entreprises, les startups et les acteurs clés de l’écosystème numérique pour créer des collaborations concrètes.",
    icon: CalendarDays,
    media: {
      type: "image",
      src: "/Galeries/img9.jpeg",
      alt: "Rencontres et échanges autour de la technologie",
    },
  },
  {
    title: "Masterclass #6 ",
    category: "IMPACT",
    description:
      "Nous avons organisé 15 masterclasses en ligne autour du développement et de l’IA, de l’entrepreneuriat, de la cybersécurité, des réseaux et du cloud, de l’IA et de la data, et bien plus encore.",
    icon: Rocket,
    media: {
      type: "image",
      src: "/Galeries/master.jpeg",
      alt: "Collaboration et réalisation de projets technologiques",
    },
  },
  {
    title: "Atelier de Formation #4",
    category: "APPRENTISSAGE",
    description:
      "Approfondissez vos connaissances et poursuivez votre apprentissage à votre rythme.",
    icon: BookOpen,
    media: {
      type: "image",
      src: "/Galeries/for.jpeg",
      alt: "Ressources et apprentissage numérique",
    },
  },
];

const INTERVALLE = 3500;

function MediaContent({
  media,
  title,
  onOpen,
}: {
  media: SlideMedia;
  title: string;
  onOpen: () => void;
}) {
  return (
    <div className="absolute inset-0">
      {media.type === "image" && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {media.type === "video" && (
        <video
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          poster={media.poster}
          aria-label={media.alt}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={media.src} type="video/mp4" />
        </video>
      )}

      {media.type === "youtube" && (
        <Image
          src="/Galeries/Haka/haka1.png"
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 85vw, 33vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-black/30 to-black/5" />

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir le média : ${title}`}
        className="absolute inset-0 z-10 flex cursor-zoom-in items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#fd800a]"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-[#fd800a]/95 text-white shadow-xl transition duration-300 hover:scale-110">
          <Play size={23} fill="currentColor" />
        </span>
      </button>
    </div>
  );
}

export default function SectionAlumniStories() {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);

  const openSlide = (index: number) => {
    pauseRef.current = true;
    setIsPaused(true);
    setActiveSlideIndex(index);
  };

  const closeSlide = useCallback(() => {
    setActiveSlideIndex(null);
    pauseRef.current = false;
    setIsPaused(false);
  }, []);

  const navigateSlide = useCallback((direction: -1 | 1) => {
    setActiveSlideIndex((current) => {
      if (current === null) return null;
      return (current + direction + SLIDES.length) % SLIDES.length;
    });
  }, []);

  const scrollCards = useCallback((direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector<HTMLElement>("[data-slide-card]");
    if (!card) return;

    const gap = Number.parseFloat(
      window.getComputedStyle(carousel).columnGap
    ) || 0;

    const distance = card.getBoundingClientRect().width + gap;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (direction === 1 && carousel.scrollLeft >= maxScroll - 8) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && carousel.scrollLeft <= 8) {
      carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      carousel.scrollBy({
        left: direction * distance,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (activeSlideIndex === null) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSlide();
      if (event.key === "ArrowRight") navigateSlide(1);
      if (event.key === "ArrowLeft") navigateSlide(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlideIndex, closeSlide, navigateSlide]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updatePage = () => {
      const firstCard = carousel.querySelector<HTMLElement>("[data-slide-card]");
      if (!firstCard) return;

      const gap = Number.parseFloat(
        window.getComputedStyle(carousel).columnGap
      ) || 0;

      const distance = firstCard.getBoundingClientRect().width + gap;

      const nextPage = Math.min(
        SLIDES.length - 1,
        Math.max(0, Math.round(carousel.scrollLeft / distance))
      );

      setCurrentPage((currentPage) =>
        currentPage === nextPage ? currentPage : nextPage
      );
    };

    const timer = window.setInterval(() => {
      if (pauseRef.current || reducedMotion.matches) return;

      const firstCard = carousel.querySelector<HTMLElement>("[data-slide-card]");
      if (!firstCard) return;

      const gap = Number.parseFloat(
        window.getComputedStyle(carousel).columnGap
      ) || 0;

      const distance = firstCard.getBoundingClientRect().width + gap;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (maxScroll <= 0) return;

      if (carousel.scrollLeft >= maxScroll - 8) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: distance, behavior: "smooth" });
      }
    }, INTERVALLE);

    carousel.addEventListener("scroll", updatePage, { passive: true });

    return () => {
      window.clearInterval(timer);
      carousel.removeEventListener("scroll", updatePage);
    };
  }, []);

  const pauseCarousel = () => {
    pauseRef.current = true;
    setIsPaused(true);
  };

  const resumeCarousel = () => {
    if (activeSlideIndex !== null) return;
    pauseRef.current = false;
    setIsPaused(false);
  };

  return (
    <section
      id="nos-activites"
      className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(253,128,10,0.12), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* En-tête */}
        <header className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
           

            <h2 className="font-b612 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-4xl lg:text-5xl">
              Plongez au cœur de nos <span className="text-[#fd800a]">activités</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Formations, masterclass, ateliers, bootcamps, hackathons,
              conférences et rencontres : découvrez comment Ghostech
              accompagne les talents et stimule l'innovation numérique
              en Afrique.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => scrollCards(-1)}
              aria-label="Activité précédente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#fd800a] hover:text-[#fd800a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a]"
            >
              <ArrowLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scrollCards(1)}
              aria-label="Activité suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fd800a] text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a]"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </header>

        {/* Carrousel */}
        <div
          onMouseEnter={pauseCarousel}
          onMouseLeave={resumeCarousel}
          onFocusCapture={pauseCarousel}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              resumeCarousel();
            }
          }}
          onTouchStart={pauseCarousel}
          onTouchEnd={() => window.setTimeout(resumeCarousel, 1800)}
        >
          <div
            ref={carouselRef}
            role="region"
            aria-label="Activités et événements Ghostech"
            aria-roledescription="carrousel"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
          >
            {SLIDES.map((slide, index) => {
              const Icon = slide.icon;

              return (
                <article
                  key={slide.title}
                  data-slide-card
                  className="group relative flex min-h-[410px] w-[85vw] max-w-[370px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#fd800a]/50 hover:shadow-[0_20px_50px_rgba(253,128,10,0.12)] sm:w-[320px] lg:w-[350px]"
                >
                  <div className="relative min-h-[225px] flex-1 overflow-hidden">
                    <MediaContent
                      media={slide.media}
                      title={slide.title}
                      onOpen={() => openSlide(index)}
                    />

                    <span className="absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {slide.category}
                    </span>
                  </div>

                  <div className="flex flex-col p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Icon size={24} className="text-[#fd800a]" />
                      <span className="text-xs font-bold text-white/25">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(SLIDES.length).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-b612 text-lg font-extrabold leading-snug text-white sm:text-xl">
                      {slide.title}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-zinc-400 sm:text-sm">
                      {slide.description}
                    </p>

                   
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Pied de carrousel */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <p className="text-[10px] text-zinc-500 sm:text-xs">
            {isPaused ? "Défilement en pause" : "Explorez les activités Ghostech"}
          </p>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Afficher ${slide.title}`}
                onClick={() => {
                  const carousel = carouselRef.current;
                  const card = carousel?.querySelectorAll<HTMLElement>(
                    "[data-slide-card]"
                  )[index];

                  if (card && carousel) {
                    carousel.scrollTo({
                      left: card.offsetLeft - carousel.offsetLeft,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "w-7 bg-[#fd800a]"
                    : "w-1.5 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Domaines d'activité */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Formations", icon: GraduationCap },
            { label: "Masterclass", icon: Users },
            { label: "Ateliers", icon: Code2 },
            { label: "Hackathons", icon: Lightbulb },
            { label: "Événements", icon: CalendarDays },
            { label: "Projets", icon: Rocket },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#fd800a]/40 hover:bg-white/[0.06]"
              >
                <Icon size={21} className="shrink-0 text-[#fd800a]" />
                <span className="text-xs font-semibold text-zinc-300">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

       
      </div>

      {/* Fenêtre multimédia */}
      {activeSlideIndex !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-3 backdrop-blur-md sm:p-8"
          role="presentation"
          onClick={closeSlide}
        >
          <button
            type="button"
            aria-label="Fermer le média"
            onClick={closeSlide}
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:bg-[#fd800a] hover:text-white sm:right-6 sm:top-6"
          >
            <X size={21} />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-label={SLIDES[activeSlideIndex].title}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-6xl"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#101010]">
              {SLIDES[activeSlideIndex].media.type === "image" && (
                <Image
                  src={SLIDES[activeSlideIndex].media.src}
                  alt={SLIDES[activeSlideIndex].media.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}

              {SLIDES[activeSlideIndex].media.type === "video" && (
                <video
                  key={SLIDES[activeSlideIndex].media.src}
                  autoPlay
                  controls
                  playsInline
                  poster={SLIDES[activeSlideIndex].media.poster}
                  className="h-full w-full object-contain"
                >
                  <source
                    src={SLIDES[activeSlideIndex].media.src}
                    type="video/mp4"
                  />
                </video>
              )}

              {SLIDES[activeSlideIndex].media.type === "youtube" && (
                <iframe
                  key={SLIDES[activeSlideIndex].media.videoId}
                  src={`https://www.youtube-nocookie.com/embed/${SLIDES[activeSlideIndex].media.videoId}?autoplay=1&rel=0`}
                  title={SLIDES[activeSlideIndex].media.alt}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              )}

              <button
                type="button"
                aria-label="Média précédent"
                onClick={() => navigateSlide(-1)}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition hover:bg-[#fd800a] hover:text-white sm:left-5 sm:h-12 sm:w-12"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                type="button"
                aria-label="Média suivant"
                onClick={() => navigateSlide(1)}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition hover:bg-[#fd800a] hover:text-white sm:right-5 sm:h-12 sm:w-12"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="px-2 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#fd800a]">
                {SLIDES[activeSlideIndex].category}
              </p>
              <h3 className="mt-2 text-lg font-bold text-white sm:text-2xl">
                {SLIDES[activeSlideIndex].title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {SLIDES[activeSlideIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
