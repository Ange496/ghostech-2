"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Partenaires from "@/src/composants/communs/Partenaires";
import { polesGhostech } from "@/src/donnees/polesData";

export default function PolesListSection() {
  const [activeCategory, setActiveCategory] = useState<
    "tous" | "technique" | "design-marketing" | "innovation"
  >("tous");

  const filteredPoles =
    activeCategory === "tous"
      ? polesGhostech
      : polesGhostech.filter((p) => p.category === activeCategory);

  const filterButtons = [
    { id: "tous", label: "Tous les pôles" },
    { id: "technique", label: "Tech & Ingénierie" },
    { id: "design-marketing", label: "Design & Stratégie" },
    { id: "innovation", label: "Écosystème" },
  ] as const;

  return (
    <section
      id="poles"
      className="relative my-4 flex w-full flex-col items-center overflow-hidden bg-white py-12 sm:my-8 sm:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#F7F9FC] to-transparent" />

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#0E2B3A] via-[#123A4E] to-[#0B1F2D] p-6 text-white shadow-[0_30px_60px_rgba(11,31,45,0.18)] sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FD800A]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-200">
                  Cartographie des pôles
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Nos départements
                <span className="block text-[#FD800A]">spécialisés</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="text-xl font-black text-[#FD800A]">{polesGhostech.length}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Pôles</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="text-xl font-black text-[#F5C27A]">4</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Domaines</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm sm:col-span-1 col-span-2">
                <p className="text-xl font-black text-[#A6E7D8]">100%</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Pratique</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Explorez nos expertises</p>
            <p className="mt-1 text-xs text-slate-500">
              Découvrez les domaines qui structurent l’écosystème Ghostech.
            </p>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1.5 scrollbar-none pb-1 sm:flex-wrap sm:overflow-visible">
            {filterButtons.map((btn) => {
              const isActive = activeCategory === btn.id;

              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActiveCategory(btn.id)}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 sm:px-4 ${
                    isActive
                      ? "bg-[#022329] text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-[#022329]"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500" aria-live="polite" aria-atomic="true">
            <span className="font-bold text-slate-900">{filteredPoles.length}</span>{" "}
            {filteredPoles.length > 1 ? "pôles affichés" : "pôle affiché"}
          </p>

          {activeCategory !== "tous" && (
            <button
              type="button"
              onClick={() => setActiveCategory("tous")}
              className="text-xs font-bold text-[#FD800A] transition-colors hover:text-orange-700"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredPoles.map((pole, index) => (
              <motion.article
                layout
                key={pole.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FD800A]/40 hover:shadow-[0_24px_50px_rgba(253,128,10,0.08)]"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <Image
                    src={pole.image}
                    alt={`Illustration du pôle ${pole.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800 backdrop-blur-sm">
                    {pole.category === "technique"
                      ? "Tech"
                      : pole.category === "design-marketing"
                        ? "Design"
                        : "Innovation"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-[#E96F00]">
                    {pole.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {pole.desc}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Nos missions
                    </p>
                    <ul className="space-y-2">
                      {pole.missions.slice(0, 3).map((mission) => (
                        <li key={mission} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FD800A]" />
                          <span>{mission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredPoles.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-lg font-bold text-slate-900">Aucun pôle dans cette catégorie</p>
            <button
              type="button"
              onClick={() => setActiveCategory("tous")}
              className="mt-5 rounded-full bg-[#FD800A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-700"
            >
              Voir tous les pôles
            </button>
          </div>
        )}

        <div className="mt-14 flex flex-col items-center border-t border-slate-100 pt-8 text-center sm:mt-16">
        </div>
        <Partenaires />
      </div>
    </section>
  );
}
