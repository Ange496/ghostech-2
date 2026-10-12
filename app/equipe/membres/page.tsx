"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { db } from "@/src/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function MembresEquipe() {
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [activeMember, setActiveMember] = useState<any | null>(null);

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;

    const fetchDynamicMembers = async () => {
      try {
        const q = query(collection(firestore, "users"), where("role", "in", ["membre", "admin"]));
        const querySnapshot = await getDocs(q);
        const dynamicMembers: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dynamicMembers.push({
            id: doc.id,
            name: data.name || "Nouveau Membre",
            role: data.role === "admin" ? "Administrateur Ghostech" : "Membre Ghostech",
            category: data.category || "tech",
            skills: data.skills || ["Innovation", "Tech"],
            description: data.bio || data.description || "Passionné de tech et nouveau membre de l'équipe Ghostech.",
            avatar: data.photoURL || data.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=444&color=fff`
          });
        });
        
        setAllMembers(dynamicMembers);
        if (dynamicMembers.length > 0) {
          setActiveMember(dynamicMembers[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des membres Firebase:", error);
      }
    };

    fetchDynamicMembers();
  }, []);

  return (
    <main className="w-full min-h-dvh bg-[#1c1c1c] pt-20 text-white flex flex-col items-center font-dm-sans">

      {/* HEADER SECTION (EXACTLY LIKE IMAGE) */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start pt-20 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto gap-10">
        <div className="shrink-0">
          <h1 className="text-4xl md:text-[56px] leading-none font-bold text-white tracking-tighter uppercase mb-2">
            L'EQUIPE GHOSTECH.
          </h1>
          <p className="text-sm text-gray-300 flex items-center gap-2">
            <span className="w-[18px] h-[18px] bg-white text-black inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold">G</span>
            <span className="italic">innovation partners</span>
          </p>
        </div>

        <div className="lg:max-w-3xl text-gray-200 text-lg md:text-[22px] font-light leading-snug lg:text-left mt-2 lg:mt-0">
          <p>
            Derrière chaque système performant, chaque interface millimétrée et chaque modèle prédictif se cache un talent unique. Parcourez notre collectif pluridisciplinaire et rencontrez les visages qui font vibrer notre moteur d'innovation.
          </p>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <section className="w-full max-w-[1600px] px-6 md:px-12 pb-16 sm:pb-24 flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">

        {/* LEFT: INFO BOX */}
        <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 lg:sticky top-24">
          <div className="aspect-auto sm:aspect-square min-h-[290px] border border-white/50 p-6 flex flex-col justify-between relative overflow-hidden rounded-xl sm:rounded-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMember?.id}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[20px] sm:text-[22px] font-normal text-white mb-0 leading-tight tracking-tight">{activeMember?.name}</h4>
                    <p className="text-[14px] sm:text-[15px] text-gray-300 mt-1">{activeMember?.role}</p>
                  </div>
                  {/* Thumbnail in corner */}
                  <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] shrink-0 overflow-hidden bg-[#444] ml-3 rounded-md">
                    <img src={activeMember?.avatar} alt={activeMember?.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 sm:mt-6 text-[13px] sm:text-[14px] text-gray-400 font-light leading-relaxed pr-2">
                  {activeMember?.description}
                </div>

                <div className="text-[12px] sm:text-[13px] text-white uppercase tracking-widest mt-auto pt-4 sm:pt-6 leading-relaxed">
                  MADE IN GHOSTECH 2026<br />
                  INNOVATION INTELLIGENCE<br />
                  TECH CREATIVE
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: PHOTOS GRID */}
        <div className="w-full flex-1 h-[450px] sm:h-[500px] lg:h-[650px] xl:h-[750px] overflow-y-auto pr-2 lg:pr-4 pb-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
            {allMembers.map((membre, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                key={membre.id}
                onMouseEnter={() => setActiveMember(membre)}
                onClick={() => setActiveMember(membre)}
                role="button"
                tabIndex={0}
                aria-label={`Voir profil de ${membre.name}`}
                className="aspect-square relative overflow-hidden bg-[#444] cursor-pointer rounded-lg sm:rounded-none focus:outline-none focus:ring-2 focus:ring-[#fd800a]"
              >
                <img
                  src={membre.avatar}
                  alt={membre.name}
                  className={`w-full h-full object-cover transition-all duration-[600ms] ease-out ${activeMember?.id === membre.id
                      ? 'grayscale-0 opacity-100 scale-105 ring-2 ring-[#fd800a]'
                      : 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100 scale-100'
                    }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}