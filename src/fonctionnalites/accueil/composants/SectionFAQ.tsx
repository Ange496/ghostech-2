
"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  ArrowUpRight,
  CheckCircle2,
  Users,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

export default function SectionInstructeurs() {
  return (
    <section
      id="communaute"
      className="relative w-full overflow-hidden bg-white py-12 sm:py-35 lg:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Conteneur principal */}
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#fd800a] shadow-[0_25px_80px_rgba(253,128,10,0.18)] sm:rounded-[2.5rem]">
          {/* Arrière-plan décoratif */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.22), transparent 40%), linear-gradient(120deg, #fd800a 0%, #f57a05 55%, #e96800 100%)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-36 -z-10 h-96 w-96 rounded-full border-[50px] border-white/[0.07]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full border-[40px] border-white/[0.07]"
          />

          {/* Contenu */}
          <div className="grid grid-cols-1 items-center gap-10 p-6 sm:p-10 md:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:p-16 xl:p-20">
            {/* Texte */}
            <div className="flex flex-col items-start">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white sm:text-xs">
                  Rejoignez Ghostech
                </span>
              </div>

              {/* Titre */}
              <h2 className="max-w-2xl font-b612 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl xl:text-6xl">
                La tech se construit{" "}
                <span className="text-[#171717]">
                  ensemble.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
                Intégrez notre communauté WhatsApp pour rester informé
                de nos formations, masterclass, hackathons, conférences
                et opportunités dans le numérique.
              </p>

              {/* Avantages */}
              <div className="mt-8 flex flex-col gap-4">
                {[
                  {
                    icon: CalendarDays,
                    text: "Recevez les annonces de nos prochains événements",
                  },
                  {
                    icon: Users,
                    text: "Échangez avec des passionnés de technologie",
                  },
                  {
                    icon: MessageCircle,
                    text: "Découvrez les opportunités et actualités de Ghostech",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.text}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                        <CheckCircle2 size={16} />
                      </span>

                      <p className="text-sm leading-6 text-white/95">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Bouton */}
              <a
                href="https://chat.whatsapp.com/Le6R6EvCKOR8I3kmQEd9XS"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#128C7E] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#fd800a] sm:w-auto"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span>Rejoindre le groupe WhatsApp</span>
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <p className="mt-4 text-xs leading-5 text-white/70">
                Rejoignez-nous et construisons ensemble l'avenir
                numérique de l'Afrique.
              </p>
            </div>

            {/* Visuel */}
            <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
              {/* Décoration arrière */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rotate-3 rounded-[2rem] border border-white/30 bg-white/10"
              />

              {/* Image principale */}
              <div className="group relative aspect-[4/4.5] overflow-hidden rounded-[1.75rem] bg-[#171717] shadow-2xl sm:aspect-[4/4.2]">
                <Image
                  src="/Galeries/img_1.png"
                  alt="Les talents et passionnés qui font vivre l'écosystème technologique Ghostech"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Signature sur l'image */}
                

                {/* Icône WhatsApp décorative */}
                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-white backdrop-blur-md sm:right-6 sm:top-6 sm:h-14 sm:w-14">
                  <FaWhatsapp size={27} />
                </div>
              </div>

              {/* Carte flottante */}
              <div className="absolute -bottom-5 left-3 right-3 flex items-center gap-3 rounded-2xl border border-white/60 bg-white p-4 shadow-xl sm:-bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#fd800a]">
                  <Users size={25} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#111111]">
                    Une communauté engagée
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Des talents réunis par la technologie.
                  </p>
                </div>

                <div className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#128C7E]">
                  <FaWhatsapp size={19} />
                </div>
              </div>
            </div>
          </div>

        
         
        </div>
      </div>
    </section>
  );
}
