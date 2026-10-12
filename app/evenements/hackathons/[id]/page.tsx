"use client";

import { use } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaMapPin, FaTrophy, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { useHackathonManager } from "@/src/fonctionnalites/dashboard/hooks/useHackathonManager";

interface Hackathon {
  id: number | string;
  title: string;
  status: "a-venir" | "termine";
  statusLabel: string;
  statusColor: string;
  date: string;
  prizePool: string;
  participants: number;
  theme: string;
  tags: string[];
  img: string;
  cardStyle: string;
  titleColor: string;
  textColor: string;
  lieu?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HackathonDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { hackathons, isLoading: loading } = useHackathonManager();
  const hack = hackathons.find((item) => String(item.id) === resolvedParams.id) as Hackathon | undefined;

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!hack) {
    return (
      <div className="min-h-dvh bg-[#FAFAFA] flex items-center justify-center p-6 text-center text-slate-800">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
          <FaExclamationTriangle className="text-amber-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Hackathon introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Désolé, le hackathon que vous recherchez n&apos;existe pas ou a été retiré.
          </p>
          <Link
            href="/evenements/hackathons"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition"
          >
            <FaArrowLeft /> Retour aux hackathons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-dvh bg-[#FAFAFA] text-slate-800 font-sans antialiased pt-24 sm:pt-28 pb-16 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* GRILLE CÔTE À CÔTE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLONNE GAUCHE : IMAGE UNIQUEMENT (SANS CARD, GRANDE TAILLE, CÔTÉ GAUCHE) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <img
              src={hack.img}
              alt={hack.title}
              className="w-full h-auto max-h-[600px] object-contain rounded-3xl"
            />
          </div>

          {/* COLONNE DROITE : TOUT LE TEXTE ET BOUTONS */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* BOUTON RETOUR */}
            <Link
              href="/evenements/hackathons"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-black transition text-sm font-semibold group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
              Retour aux hackathons
            </Link>

            <div className="space-y-4">
              <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                hack.status === "termine" ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
              }`}>
                {hack.status === "termine" ? "Terminé" : "Inscription Ouverte"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {hack.title}
              </h1>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">
                Thématique & Défis
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {hack.theme}
              </p>

              {hack.tags && hack.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-50">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Technologies clés</h4>
                  <div className="flex flex-wrap gap-2">
                    {hack.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3 mb-4">
                Organisation de l&apos;événement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 shrink-0">
                    <FaCalendarAlt className="text-base" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</h4>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{hack.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 shrink-0">
                    <FaMapPin className="text-base" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lieu</h4>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{hack.lieu || "En ligne / Hybride"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 shrink-0">
                    <FaTrophy className="text-base" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cagnotte Globale</h4>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{hack.prizePool}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 shrink-0">
                    <FaUsers className="text-base" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Participants Attendus</h4>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{hack.participants} personnes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Inscription au défi</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {hack.status === "termine" 
                    ? "Ce hackathon est terminé. Les inscriptions sont closes."
                    : "Formez votre équipe et inscrivez-vous dès maintenant pour participer aux épreuves !"
                  }
                </p>
              </div>

              {hack.status === "termine" ? (
                <button
                  disabled
                  className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-xl cursor-not-allowed border border-red-600 transition-all text-center flex items-center justify-center gap-2"
                >
                  Terminé
                </button>
              ) : (
                <button
                  onClick={() => alert("Formulaire d'inscription au hackathon !")}
                  className="w-full py-3 bg-black hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  Participer
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
