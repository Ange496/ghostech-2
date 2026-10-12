"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

/**
 * SectionApproche — Section "Notre approche pédagogique" avec vidéo + compétences.
 * Design harmonisé avec la SectionObjectifs (couleurs #fd800a, #111111, blanc, coins arrondis).
 */
export default function SectionApproche() {
  return (
    <section className="w-full bg-white py-20 px-4 flex justify-center relative overflow-hidden">
      
      {/* Effet d'arrière-plan discret (identique à SectionObjectifs) */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 opacity-5"
        style={{
          background: "radial-gradient(circle at 20% 80%, #fd800a 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center">
        
        {/* Titre : style grand journal / magazine */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight leading-[1.08] text-center mb-8 sm:mb-12 md:mb-16 font-b612">
          QUI SOMME <span className="text-[#fd800a]">NOUS ?</span>
        </h2>

        {/* Grille Image/Média + Texte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full mb-12 sm:mb-16 md:mb-20">
          
          {/* Image : coins très arrondis et ombre douce */}
          <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative border border-zinc-200">
            <Image
              src="/Galeries/imag2.jpeg"
              alt="Talent Ghostech explorant les technologies numériques"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Texte : mise en page aérée et lisible */}
          <div className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed space-y-4 sm:space-y-6 text-left sm:text-justify">
            <p>
              <span className="text-[#fd800a] font-bold">
                Ghostech est une organisation technologique et d’innovation africaine
              </span>{" "}
              qui œuvre au développement des talents, à la promotion de la technologie et à la création de solutions numériques à fort impact.
            </p>
            <p>
              Notre ambition est de contribuer à l’émergence d’une nouvelle génération de talents africains capables de maîtriser les technologies,
              <span className="font-bold text-[#111111]"> d’innover et de répondre aux défis de leur environnement par des solutions concrètes.</span>
            </p>
            <p>
              Ghostech crée un environnement où les jeunes talents peuvent apprendre, collaborer, expérimenter, créer et transformer leurs compétences en projets concrets, à travers sept pôles d’expertise. Notre action repose sur trois dimensions fondamentales : développer les talents, construire des solutions et créer de l’impact. Ghostech organise formations, conférences, ateliers, hackathons, rencontres professionnelles et projets collaboratifs afin de favoriser le partage de connaissances, l’innovation et la création d’opportunités — en créant des passerelles entre talents, entreprises, institutions, établissements d’enseignement, startups et communautés technologiques.
            </p>
            
          </div>
        </div>

      </div>
    </section>
  );
}