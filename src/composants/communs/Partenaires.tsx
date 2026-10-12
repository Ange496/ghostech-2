"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const partenaires = [
  { name: "Les go Creatives", src: "/partenaire/Logo-go.png" },
  { name: "DigiFemme", src: "/partenaire/DigiFemmeCI.svg" },
  { name: "NEDDIGI", src: "/partenaire/NEDDIGI.png" },
  { name: "AIESEC", src: "/partenaire/AIESEC-Logo.jpg" },
  { name: "IT-Leadher", src: "/partenaire/IT-Leadher.svg" },
  { name: "AfroLink", src: "/partenaire/AfroLink.png" },
  { name: "Eranove", src: "https://tse2.mm.bing.net/th/id/OIP.0i7-R5msyyOGb-mJdsDZEAHaDY?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "OIP", src: "/partenaire/OIP.webp" },
  { name: "Centre Ivoirien de Robotique", src: "https://tse2.mm.bing.net/th/id/OIP.S94WnqrakHL3eRHHCOtdNAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "ABIDJANAISES IN TECH", src: "https://frenchtechabidjan.com/wp-content/uploads/2025/06/28.webp" },
  { name: "IUA", src: "https://www.iuaci.org/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-12-at-19.56.21.jpeg" },

];

export default function Partenaires() {
  const isHome = usePathname() === "/";
  const duplicatedPartenaires = [...partenaires, ...partenaires];

  return (
    <section className="w-full max-w-5xl px-4 mt-12 sm:mt-20 pb-16 sm:pb-24 text-center relative z-10 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
          {isHome ? "Créer des passerelles pour l’innovation africaine" : "Nos partenaires impliqués dans nos actions"}
        </h3>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mb-12 font-medium">
          {isHome
            ? "Des passerelles entre talents, entreprises, institutions, établissements d’enseignement, startups et communautés technologiques."
            : "Ils soutiennent l'innovation et collaborent avec nous pour propulser l'écosystème tech."}
        </p>
        <div className="w-full overflow-hidden" aria-label="Logos des partenaires">
          <motion.div
            className="flex w-max gap-6 md:gap-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {duplicatedPartenaires.map((partenaire, index) => (
              <div key={`${partenaire.name}-${index}`} className="w-[min(38vw,15rem)] shrink-0 px-2 md:w-[min(25vw,15rem)] md:px-4 flex items-center justify-center">
                <img
                  src={partenaire.src}
                  alt={partenaire.name}
                  className="h-20 w-auto max-w-[150px] object-contain transition duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
