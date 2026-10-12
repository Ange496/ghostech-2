"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { CalendarDays, MapPin, Trophy, Users, ArrowRight } from "lucide-react";
import { useHackathonManager } from "@/src/fonctionnalites/dashboard/hooks/useHackathonManager";

type HackathonStatus = "termine" | "a_venir" | string;

interface Hackathon {
  id: string;
  title: string;
  theme?: string;
  img?: string;
  date?: string;
  lieu?: string;
  prizePool?: string;
  participants?: number;
  tags?: string[];
  status?: HackathonStatus;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(raw?: string): string {
  if (!raw) return "Date à préciser";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return dateFormatter.format(parsed);
}

function HackathonSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-52 bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 rounded bg-gray-100" />
        </div>
        <div className="h-9 w-40 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function HackathonsPage() {
  const { hackathons, isLoading } = useHackathonManager();

  // Trier : à venir d'abord, puis par date décroissante
  const sortedHackathons = useMemo<Hackathon[]>(() => {
    return [...(hackathons as Hackathon[])].sort((a, b) => {
      const aDone = a.status === "termine" ? 1 : 0;
      const bDone = b.status === "termine" ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });
  }, [hackathons]);

  return (
    <main className="min-h-dvh bg-white px-4 pb-20 pt-24 font-sans text-gray-900 antialiased sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Kicker éditorial */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff6500]" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#ff6500]">
            Événements &amp; Challenges Technologiques
          </p>
        </div>

        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-[#02073E] sm:text-3xl md:text-4xl">
          Formations Immersives &amp; Hackathons Ghostech
        </h1>

        <section className="mt-14" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <HackathonSkeleton key={i} />
              ))}
            </div>
          ) : sortedHackathons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <Trophy className="mx-auto mb-3 text-gray-300" size={40} aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700">
                Aucun événement n&apos;est publié pour le moment.
              </p>
              <p className="mt-1 text-xs text-gray-500">Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sortedHackathons.map((hackathon) => {
                const isDone = hackathon.status === "termine";
                const statusLabel = isDone ? "Terminé" : "À venir";

                return (
                  <article
                    key={hackathon.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative h-52 bg-gray-100">
                      {hackathon.img ? (
                        <Image
                          src={hackathon.img}
                          alt={hackathon.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <Trophy size={40} aria-hidden="true" />
                        </div>
                      )}
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                          isDone
                            ? "bg-gray-900/85 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-bold text-[#02073E]">
                        {hackathon.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {hackathon.theme}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={16} className="shrink-0 text-[#ff6500]" aria-hidden="true" />
                          <span>{formatDate(hackathon.date)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={16} className="shrink-0 text-[#ff6500]" aria-hidden="true" />
                          <span>{hackathon.lieu || "En ligne / Hybride"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Trophy size={16} className="shrink-0 text-[#ff6500]" aria-hidden="true" />
                          <span>{hackathon.prizePool || "Prix à définir"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Users size={16} className="shrink-0 text-[#ff6500]" aria-hidden="true" />
                          <span>{hackathon.participants ?? 0} participants max</span>
                        </p>
                      </div>

                      {hackathon.tags && hackathon.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {hackathon.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-5">
                        <Link
                          href={`/evenements/hackathons/${hackathon.id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#02073E] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#ff6500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6500] focus-visible:ring-offset-2"
                          aria-label={`Voir le hackathon ${hackathon.title}`}
                        >
                          Voir le hackathon
                          <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}