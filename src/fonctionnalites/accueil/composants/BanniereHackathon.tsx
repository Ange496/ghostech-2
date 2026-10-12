
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiZap,
} from "react-icons/fi";

export default function BanniereHackathon() {
  return (
    <section
      className="mx-auto mb-10 w-full max-w-screen-2xl px-4 sm:px-6"
      aria-labelledby="gtech-banner-title"
    >
      <div className="group relative isolate overflow-hidden rounded-2xl
        bg-[#090909] text-white shadow-xl shadow-black/10">

        {/* Lumières d'arrière-plan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32
            -z-10 h-80 w-80 rounded-full bg-[#fd800a]/20 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3
            -z-10 h-64 w-64 rounded-full bg-orange-600/10 blur-[90px]"
        />

        <div className="grid min-h-[320px] md:grid-cols-[1.1fr_0.9fr]">

          {/* CONTENU */}
          <div className="relative z-10 flex flex-col items-start
            justify-center p-6 sm:p-8 lg:p-10">

            {/* Identité */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-black tracking-[0.2em]">
                GHOS<span className="text-[#fd800a]">TECH</span>
              </span>

              <span className="rounded-full border border-[#fd800a]/40
                bg-[#fd800a]/10 px-3 py-1 text-[10px] font-bold
                uppercase tracking-[0.16em] text-orange-300">
                Événement phare 2026
              </span>
            </div>

            {/* Titre */}
            <p className="mb-2 flex items-center gap-2 text-xs
              font-bold uppercase tracking-[0.2em] text-[#fd800a]">
              
              Technologie · Innovation · IA
            </p>

            <h2
              id="gtech-banner-title"
              className="max-w-xl text-3xl font-black leading-[1.08]
                tracking-tight sm:text-4xl lg:text-5xl"
            >
              G-TECH
              <span className="block text-[#fd800a]">
                SUMMIT 2026
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
              Deux jours pour connecter les talents, explorer les
              innovations technologiques et faire émerger les solutions
              qui façonneront l’Afrique de demain.
            </p>

            {/* Informations */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              <div className="flex items-center gap-2 text-xs
                font-medium text-white/80 sm:text-sm">
                <FiCalendar className="h-4 w-4 shrink-0 text-[#fd800a]" />
                18 & 19 décembre 2026
              </div>

              <div className="flex items-center gap-2 text-xs
                font-medium text-white/80 sm:text-sm">
                <FiMapPin className="h-4 w-4 shrink-0 text-[#fd800a]" />
                Abidjan, Côte d’Ivoire
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex w-full flex-col gap-3
              sm:w-auto sm:flex-row">
              <Link
                href="https://summit.ghostech.tech"
                className="inline-flex items-center justify-center gap-2
                  rounded-xl bg-[#fd800a] px-6 py-3.5 text-sm
                  font-bold text-white shadow-lg shadow-orange-600/20
                  transition-all duration-200 hover:-translate-y-0.5
                  hover:bg-[#ff922e] focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-orange-300
                  focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                S’inscrire au Summit
                <FiArrowRight className="h-4 w-4 transition-transform
                  group-hover:translate-x-1" />
              </Link>

            </div>

            <p className="mt-4 text-[11px] leading-5 text-white/40">
              Conférences · Ateliers pratiques · Startup Villa · Networking
            </p>
          </div>

          {/* VISUEL */}
          <div className="relative min-h-[230px] overflow-hidden
            bg-[#15110e] md:min-h-full">

            <Image
              src="/header_photo/4l.jpeg"
              alt="Innovation et talents technologiques au G-TECH Summit de Ghostech"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center transition-transform
                duration-700 group-hover:scale-[1.04]"
            />

            {/* Dégradé de lisibilité */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t
                from-black/70 via-black/10 to-black/10
                md:bg-gradient-to-r md:from-[#090909]/50
                md:via-transparent md:to-transparent"
            />

            {/* Accent graphique */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-2 w-1/2
                bg-[#fd800a]"
            />

            {/* Signature visuelle */}
            <div className="absolute bottom-5 left-5 right-5
              rounded-xl border border-white/15 bg-black/45
              p-4 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7">
              <p className="text-[10px] font-bold uppercase
                tracking-[0.2em] text-orange-300">
                L’avenir se construit maintenant
              </p>

              <p className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                Construire. Impacter. Conquérir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
