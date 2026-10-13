"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Target,
  Globe2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import Partenaires from "@/src/composants/communs/Partenaires";

const statistics = [
  {
    value: 250,
    suffix: "",
    label: "Personnes formées",
    description:
      "Des compétences numériques développées pour préparer les talents aux métiers de demain.",
    icon: GraduationCap,
    color: "orange",
  },
  {
    value: 95,
    suffix: "%",
    label: "Sorties positives",
    description:
      "Un indicateur de résultats présenté dans le bilan d'impact de Ghostech.",
    icon: BriefcaseBusiness,
    color: "white",
  },
  {
    value: 90,
    suffix: "",
    label: "Femmes formées",
    description:
      "Une volonté de favoriser la participation des femmes aux métiers technologiques.",
    icon: Users,
    color: "white",
  },
];

const impactAreas = [
  {
    number: "01",
    title: "Formation numérique",
    description:
      "Développer des compétences concrètes à travers l'apprentissage, la pratique et le partage de connaissances.",
    icon: GraduationCap,
    tags: ["Compétences", "Apprentissage"],
  },
  {
    number: "02",
    title: "Insertion professionnelle",
    description:
      "Encourager l'accès aux opportunités du secteur numérique et accompagner l'évolution des talents.",
    icon: Target,
    tags: ["Emploi", "Accompagnement"],
  },
  {
    number: "03",
    title: "Inclusion & diversité",
    description:
      "Promouvoir un environnement technologique plus accessible, collaboratif et ouvert à tous les talents.",
    icon: HeartHandshake,
    tags: ["Inclusion", "Égalité des chances"],
  },
  {
    number: "04",
    title: "Partenariats & innovation",
    description:
      "Créer des synergies avec les acteurs de l'écosystème pour développer des initiatives à impact.",
    icon: Lightbulb,
    tags: ["Collaboration", "Innovation"],
  },
];

const principles = [
  {
    title: "L'humain au centre",
    description:
      "Placer les talents, leurs ambitions et leur progression au cœur de nos initiatives.",
    icon: Users,
  },
  {
    title: "L'innovation utile",
    description:
      "Encourager des compétences et des solutions technologiques adaptées aux besoins réels.",
    icon: Lightbulb,
  },
  {
    title: "L'impact collectif",
    description:
      "Construire des collaborations durables pour élargir les opportunités.",
    icon: Globe2,
  },
];

function Counter({
  target,
  suffix = "",
  className = "",
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;

    if (!element || hasStarted.current) return;
    let frame: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;

        hasStarted.current = true;
        observer.disconnect();

        if (reducedMotion) {
          setCount(target);
          return;
        }

        const duration = 1600;
        const startTime = performance.now();

        const update = (now: number) => {
          const progress = Math.min(
            (now - startTime) / duration,
            1
          );

          const eased = 1 - Math.pow(1 - progress, 4);

          setCount(Math.round(target * eased));

          if (progress < 1) {
            frame = requestAnimationFrame(update);
          }
        };

        frame = requestAnimationFrame(update);
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [target, reducedMotion]);

  return (
    <span
      ref={ref}
      aria-label={`${target}${suffix}`}
      aria-live="off"
      className={`tabular-nums ${className}`}
    >
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reducedMotion ? false : { opacity: 0, y: 22 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ImpactPage() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="min-h-dvh overflow-hidden bg-white pb-0 text-slate-900 antialiased">

      {/* HERO */}
      <section className="relative isolate mx-auto w-full max-w-360 overflow-hidden px-4 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-14 lg:pb-28 lg:pt-40">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-20 z-0 h-72 w-72 rounded-full bg-[#FD800A]/10 blur-3xl sm:h-96 sm:w-96"
          animate={
            reducedMotion
              ? undefined
              : { x: [0, -18, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 bottom-0 z-0 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl"
        />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          <Reveal className="relative z-10">

            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-[-0.045em] text-[#101820] sm:text-5xl md:text-6xl xl:text-7xl">
              La technologie
              <br />
              au service de
              <span className="relative mt-1 block text-[#FD800A]">
                l&apos;humain.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Chez Ghostech, nous croyons que le numérique peut
              ouvrir des portes, révéler des talents et contribuer
              à transformer les sociétés africaines. Notre ambition :
              rendre la technologie accessible et favoriser
              l&apos;émergence d&apos;une nouvelle génération de talents.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#indicateurs"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#FD800A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FD800A]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FD800A]/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FD800A] focus-visible:ring-offset-2"
              >
                Découvrir notre impact
                <ArrowDownRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" size={17} />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FD800A] hover:text-[#FD800A] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FD800A]"
              >
                Collaborer avec nous
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
              <div className="flex -space-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#101820] text-white">
                  <GraduationCap size={16} />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#FD800A]/10 text-[#FD800A]">
                  <Lightbulb size={16} />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-700">
                  <Handshake size={16} />
                </span>
              </div>

              <p className="max-w-xs text-xs leading-5">
                Formation, inclusion et innovation au cœur de
                notre engagement.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="group relative min-h-90 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_32px_80px_rgba(15,23,42,0.14)] sm:min-h-120 lg:min-h-142.5">
              <Image
                src="/Galeries/img_1.png"
                alt="Illustration des initiatives et de l'impact de Ghostech"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#101820]/85 via-[#101820]/5 to-[#101820]/10" />

              <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/25 px-4 py-2 shadow-lg shadow-black/10 backdrop-blur-md sm:left-7 sm:top-7">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs">
                  <Sparkles size={14} className="text-[#FD800A]" />
                  Impact & innovation
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FD800A]">
                  Notre engagement
                </p>

                <h2 className="mt-3 max-w-lg text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                  Former aujourd&apos;hui.
                  <br />
                  Transformer demain.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                  Faire des compétences numériques un levier
                  d&apos;opportunités pour les talents africains.
                </p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 -z-10 h-28 w-28 rounded-[24px] bg-[#FD800A] sm:-bottom-5 sm:-right-5 sm:h-36 sm:w-36"
            />
          </Reveal>
        </div>
      </section>

      {/* INDICATEURS */}
      <section
        id="indicateurs"
        className="scroll-mt-24 bg-[#101820] py-16 text-white sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-14">
          <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FD800A]">
                Quelques indicateurs
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Notre impact en chiffres.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-400">
              Des indicateurs pour mieux comprendre la portée
              de nos actions en matière de compétences numériques
              et d&apos;inclusion.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <Reveal key={stat.label} delay={index * 0.08}>
                  <article
                    className={`relative h-full overflow-hidden rounded-[24px] border p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                      stat.color === "orange"
                        ? "border-[#FD800A] bg-[#FD800A] text-white"
                        : "border-white/10 bg-white/4.5 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          stat.color === "orange"
                            ? "bg-white/15"
                            : "bg-white/8 text-[#FD800A]"
                        }`}
                      >
                        <Icon className="transition-transform duration-300 group-hover:scale-110" size={21} />
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          stat.color === "orange"
                            ? "text-white/70"
                            : "text-slate-500"
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-5xl font-black leading-none tracking-[-0.06em] sm:text-6xl">
                      <Counter
                        target={stat.value}
                        suffix={stat.suffix}
                        className={
                          stat.color === "orange"
                            ? "text-white drop-shadow-sm"
                            : "text-[#FD800A]"
                        }
                      />
                      </p>
                      <div
                        aria-hidden="true"
                        className={`mt-4 h-1 w-12 rounded-full ${
                          stat.color === "orange"
                            ? "bg-white/70"
                            : "bg-[#FD800A]"
                        }`}
                      />
                    </div>

                    <h3 className="mt-3 text-base font-extrabold">
                      {stat.label}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        stat.color === "orange"
                          ? "text-white/85"
                          : "text-slate-400"
                      }`}
                    >
                      {stat.description}
                    </p>

                    <div
                      aria-hidden="true"
                      className={`absolute -bottom-12 -right-8 h-32 w-32 rounded-full border-20 ${
                        stat.color === "orange"
                          ? "border-white/10"
                          : "border-white/[0.035]"
                      }`}
                    />
                  </article>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* DOMAINES D'IMPACT */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-14">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101820] sm:text-4xl lg:text-5xl">
              Un impact qui va
              <span className="text-[#FD800A]"> au-delà du code.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
              Notre démarche associe le développement des compétences,
              l&apos;ouverture des opportunités et la collaboration entre
              les acteurs de l&apos;écosystème numérique.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;

              return (
                <Reveal key={area.number} delay={index * 0.05}>
                  <article className="group flex h-full gap-5 rounded-[24px] border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FD800A] hover:shadow-[0_20px_45px_rgba(15,23,42,0.07)] sm:gap-7 sm:p-7">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                      <span className="text-xs font-black tabular-nums text-[#FD800A]">
                        {area.number}
                      </span>

                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FD800A]/10 text-[#FD800A] transition-all duration-300 group-hover:rotate-3 group-hover:bg-[#FD800A] group-hover:text-white">
                        <Icon size={22} />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-extrabold text-[#101820] sm:text-xl">
                        {area.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        {area.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {area.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPROCHE */}
      <section className="relative overflow-hidden bg-[#F7F8FA] py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#101820] via-[#142B37] to-[#0C1B24] p-7 text-white shadow-[0_30px_70px_rgba(15,23,42,0.16)] sm:p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-36 border-white/4.5"
              />

              <div className="relative z-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FD800A]">
                  <Target size={24} />
                </span>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#FD800A]">
                  Notre ambition
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Faire de la technologie un moteur de transformation.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  Nous voulons contribuer à un écosystème dans lequel
                  les jeunes peuvent apprendre, expérimenter, collaborer
                  et créer des solutions qui répondent aux défis de
                  leur environnement.
                </p>

                <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#FD800A]"
                  />
                  <p className="text-sm leading-6 text-slate-300">
                    Construire des initiatives utiles, accessibles
                    et tournées vers l&apos;avenir.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101820] sm:text-4xl">
                L&apos;impact se construit ensemble.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                Pour donner du sens à la technologie, nous misons sur
                l&apos;apprentissage, l&apos;innovation et la force du collectif.
              </p>
            </Reveal>

            <div className="mt-8 space-y-6">
              {principles.map((principle, index) => {
                const Icon = principle.icon;

                return (
                  <Reveal key={principle.title} delay={index * 0.06}>
                    <div className="group flex gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-white">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#FD800A]/20 bg-white text-[#FD800A] shadow-sm transition-all duration-300 group-hover:-rotate-3 group-hover:bg-[#FD800A] group-hover:text-white">
                        <Icon size={20} />
                      </span>

                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          {principle.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* APPEL AUX PARTENAIRES */}
      <section className="px-4 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#FD800A] px-6 py-12 text-white shadow-[0_30px_80px_rgba(253,128,10,0.2)] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-45 border-white/12 sm:h-96 sm:w-96"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#FD800A]/30 blur-3xl"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2">
                <Handshake size={15} />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                  Construisons ensemble
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Votre engagement peut faire la différence.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Vous êtes une entreprise, une institution ou un acteur
                engagé dans le numérique ? Collaborons pour développer
                des initiatives qui créent des opportunités et un impact
                durable en Afrique.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#101820] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FD800A]"
              >
                Devenir partenaire
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={17} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PARTENAIRES */}
      <section
        aria-label="Nos partenaires"
        className="bg-linear-to-b from-slate-50 to-white py-12 sm:py-16"
      >
        <Reveal className="w-full">
          <Partenaires />
        </Reveal>
      </section>
    </main>
  );
}