"use client";

import React, { useState } from "react";
import Partenaires from "@/src/composants/communs/Partenaires";
import { useCourses } from "@/src/fonctionnalites/formation/hooks/useCourses";
import CourseCard from "@/src/fonctionnalites/formation/composants/CourseCard";

const EMAIL_GHOSTECH = "ghostech92@gmail.com";

const formations = [
  {
    title: "Initiation à l'informatique et aux outils numériques",
    duration: "2 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Environnement informatique, gestion des fichiers, bureautique, outils collaboratifs et bonnes pratiques numériques.",
    project: "Réalisation d'un dossier numérique organisé et d'un document professionnel.",
  },
  {
    title: "Développement Web — HTML, CSS et JavaScript",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "HTML5, CSS3, responsive design, JavaScript, DOM et bases de Git.",
    project: "Création d'un site web responsive.",
  },
  {
    title: "Développement Full Stack",
    duration: "8 semaines",
    price: 50000,
    level: "Intermédiaire",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Front-end, back-end, API REST, bases de données, authentification, Git et déploiement.",
    project: "Conception et déploiement d'une application web complète.",
  },
  {
    title: "Python et programmation",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Variables, conditions, boucles, fonctions, structures de données, fichiers et programmation orientée objet.",
    project: "Développement d'une application Python.",
  },
  {
    title: "Data et Intelligence Artificielle",
    duration: "6 semaines",
    price: 40000,
    level: "Intermédiaire",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Python pour la donnée, NumPy, Pandas, visualisation, introduction au machine learning et à l'IA.",
    project: "Analyse d'un jeu de données et réalisation d'un mini-projet IA.",
  },
  {
    title: "Cybersécurité — Fondamentaux",
    duration: "6 semaines",
    price: 40000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Menaces, vulnérabilités, sécurité des systèmes, hygiène numérique, gestion des risques et initiation aux tests de sécurité en laboratoire autorisé.",
    project: "Audit de sécurité d'un environnement de laboratoire.",
  },
  {
    title: "Réseaux informatiques et administration système",
    duration: "6 semaines",
    price: 40000,
    level: "Débutant à intermédiaire",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Modèles OSI et TCP/IP, adressage IP, sous-réseaux, routage, commutation et services réseau.",
    project: "Conception et configuration d'un réseau de laboratoire.",
  },
  {
    title: "Linux et administration système",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Terminal, commandes Linux, utilisateurs, permissions, processus, services et scripts de base.",
    project: "Installation et administration d'un environnement Linux.",
  },
  {
    title: "UI/UX Design",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Recherche utilisateur, parcours, wireframes, prototypes, ergonomie et conception d'interfaces.",
    project: "Maquette interactive d'une application sur Figma.",
  },
  {
    title: "Design graphique",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Composition, typographie, couleurs, identité visuelle et conception de supports numériques.",
    project: "Création d'une mini-identité visuelle et de supports de communication.",
  },
  {
    title: "Marketing digital et Community Management",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Stratégie digitale, calendrier éditorial, création de contenu, réseaux sociaux et analyse des performances.",
    project: "Élaboration d'un plan de communication digitale.",
  },
  {
    title: "Entrepreneuriat et création de startup Tech",
    duration: "4 semaines",
    price: 30000,
    level: "Débutant",
    mode: "Présentiel / Distanciel / Hybride",
    program: "Identification d'un problème, proposition de valeur, modèle économique, MVP, pitch et stratégie de lancement.",
    project: "Élaboration d'un mini-business model et présentation d'un projet tech.",
  },
];

const parcours = [
  {
    name: "PACK DIGITAL STARTER",
    price: 50000,
    description: "Pour acquérir les bases essentielles du numérique.",
    modules: "Informatique, outils numériques, initiation au développement et bases du design.",
  },
  {
    name: "PACK DEVELOPER",
    price: 75000,
    description: "Pour apprendre à concevoir et développer des applications web.",
    modules: "HTML, CSS, JavaScript, Git/GitHub et développement Full Stack.",
  },
  {
    name: "PACK CYBER",
    price: 75000,
    description: "Pour construire des bases solides en réseaux et cybersécurité.",
    modules: "Réseaux, Linux, fondamentaux de la cybersécurité et initiation au pentesting en environnement autorisé.",
  },
  {
    name: "PACK DATA & IA",
    price: 70000,
    description: "Pour découvrir l'analyse des données et l'intelligence artificielle.",
    modules: "Python, traitement des données, bases de l'IA et projets pratiques.",
  },
  {
    name: "PACK TECH PRO",
    price: 120000,
    description: "Pour développer un profil technique polyvalent.",
    modules: "Développement, réseaux, cybersécurité, Git/GitHub et projet professionnel.",
  },
];

function lienInscription(titre: string, tarif?: number) {
  const sujet = `Inscription à la formation Ghostech — ${titre}`;
  const corps = `Bonjour Ghostech,\n\nJe souhaite obtenir des informations et m'inscrire à : ${titre}.${tarif ? `\nTarif annoncé : ${tarif.toLocaleString("fr-FR")} FCFA.` : ""}\n\nMerci de me communiquer le programme détaillé, les prochaines dates et les modalités d'inscription.\n\nNom complet :\nTéléphone :`;
  return `mailto:${EMAIL_GHOSTECH}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

// Type pour une formation (adaptez selon votre structure réelle)
type Formation = {
  title: string;
  duration: string;
  price: number;
  level: string;
  mode: string;
  program: string;
  project: string;
};

// Composant Modal
function FormationModal({
  formation,
  onClose,
}: {
  formation: Formation | null;
  onClose: () => void;
}) {
  if (!formation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1f26] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du modal */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0a1f26] p-6">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
              Détails de la formation
            </span>
            <h3 id="modal-title" className="mt-2 text-xl font-black leading-7 text-white sm:text-2xl">
              {formation.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="space-y-5 p-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-200">
              {formation.duration}
            </span>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
              {formation.level}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
              {formation.mode}
            </span>
          </div>

          {/* Tarif */}
          <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tarif de la formation</p>
            <p className="mt-1 text-3xl font-black text-orange-300">
              {formation.price.toLocaleString("fr-FR")} FCFA
            </p>
          </div>

          {/* Programme */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Programme</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{formation.program}</p>
          </div>

          {/* Projet pratique */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Projet pratique</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{formation.project}</p>
          </div>

          {/* Informations complémentaires */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Certificat</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Certificat de formation selon les modalités définies par Ghostech.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Places disponibles</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">À confirmer pour chaque session.</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Prochaine session</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Date communiquée après confirmation du calendrier.
            </p>
          </div>
        </div>

        {/* Pied du modal */}
        <div className="sticky bottom-0 border-t border-white/10 bg-[#0a1f26] p-6">
          <a
            href={lienInscription(formation.title, formation.price)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            S'inscrire à la formation
          </a>
        </div>
      </div>
    </div>
  );
}

type Parcours = (typeof parcours)[number];

function ParcoursModal({
  pack,
  onClose,
}: {
  pack: Parcours | null;
  onClose: () => void;
}) {
  if (!pack) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcours-modal-title"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1f26] text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Parcours professionnel</p>
            <h3 id="parcours-modal-title" className="mt-2 text-2xl font-black">{pack.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-5 p-6">
          <p className="text-sm leading-6 text-slate-300">{pack.description}</p>
          <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tarif du parcours complet</p>
            <p className="mt-1 text-3xl font-black text-orange-300">{pack.price.toLocaleString("fr-FR")} FCFA</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Modules inclus</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{pack.modules}</p>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Contactez Ghostech pour recevoir les détails du programme, les prochaines dates et les modalités d'inscription.
          </p>
        </div>
        <div className="border-t border-white/10 p-6">
          <a
            href={lienInscription(pack.name, pack.price)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            S'inscrire à ce parcours
          </a>
        </div>
      </div>
    </div>
  );
}

function CatalogueFormations({
  onSelectFormation,
  onSelectParcours,
}: {
  onSelectFormation: (formation: Formation) => void;
  onSelectParcours: (pack: Parcours) => void;
}) {
  return (
    <div className="col-span-full space-y-14">
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">Ghostech Académie</span>
        <h3 className="text-3xl font-black tracking-tight text-white md:text-4xl">Formez-vous aux métiers du numérique</h3>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
          Développez des compétences numériques concrètes, réalisez des projets pratiques et préparez-vous aux métiers de demain grâce aux formations proposées par Ghostech.
        </p>
        <p className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 text-sm font-bold text-orange-200">
          Formations à partir de 30 000 FCFA
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h4 className="text-2xl font-black text-white">Nos formations</h4>
          <p className="mt-2 text-sm text-slate-300">Des parcours pratiques pour apprendre, progresser et concrétiser vos projets.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {formations.map((formation, index) => (
            <article key={formation.title} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-orange-400/50 hover:bg-white/[0.07]">
              <div className="flex-1 p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-lg border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-black text-orange-200">{String(index + 1).padStart(2, "0")}</span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-slate-300">{formation.duration}</span>
                </div>
                <h5 className="text-lg font-bold leading-6 text-white">{formation.title}</h5>
                <p className="mt-3 text-sm leading-6 text-slate-300">{formation.program}</p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-400">Tarif de la formation</p>
                  <p className="mt-1 text-2xl font-black text-orange-300">{formation.price.toLocaleString("fr-FR")} FCFA</p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-white/10 p-5 pt-4 sm:px-6 sm:pb-6">
                <button
                  type="button"
                  onClick={() => onSelectFormation(formation)}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm font-bold text-orange-200 transition hover:bg-orange-400/20"
                >
                  Voir les détails
                </button>
                <a
                  href={lienInscription(formation.title, formation.price)}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  S'inscrire
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Parcours de spécialisation</span>
          <h4 className="mt-3 text-2xl font-black text-white sm:text-3xl">Nos packs professionnels</h4>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">Combinez plusieurs compétences complémentaires pour construire un profil technique plus complet et réaliser des projets concrets.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {parcours.map((pack) => (
            <article key={pack.name} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-orange-950/30">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-400/10 transition group-hover:bg-orange-400/20" />
              <div className="relative flex-1">
                <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-200">Parcours professionnel</span>
                <h5 className="mt-4 text-xl font-black text-white">{pack.name}</h5>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{pack.description}</p>
                <div className="my-5 border-y border-white/10 py-4">
                  <p className="text-3xl font-black text-orange-300">{pack.price.toLocaleString("fr-FR")} FCFA</p>
                  <p className="mt-1 text-xs text-slate-400">Tarif du parcours complet</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Modules inclus</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{pack.modules}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onSelectParcours(pack)}
                  className="inline-flex items-center justify-center rounded-lg border border-orange-400/40 bg-orange-400/10 px-3 py-3 text-sm font-bold text-orange-100 transition hover:bg-orange-400/20"
                >
                  Voir les détails
                </button>
                <a href={lienInscription(pack.name, pack.price)} className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-orange-600">S'inscrire</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-6 text-center sm:p-10">
        <h4 className="text-xl font-black text-white sm:text-2xl">Vous avez un objectif professionnel précis ?</h4>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">Contactez Ghostech pour choisir la formation ou le parcours le mieux adapté à votre niveau et à vos ambitions.</p>
        <a href={`mailto:${EMAIL_GHOSTECH}?subject=${encodeURIComponent("Informations sur les formations Ghostech")}`} className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Contacter Ghostech Académie</a>
      </section>
    </div>
  );
}

export default function ProgrammesFormation() {
  const [search, setSearch] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(null);
  const { courses = [] } = useCourses();
  const normalizedSearch = search.trim().toLocaleLowerCase("fr-FR");

  const filteredCourses = courses.filter((course) =>
    `${course.title ?? ""} ${course.description ?? ""}`.toLocaleLowerCase("fr-FR").includes(normalizedSearch)
  );

  const valueCards = [
    {
      title: "Nouvelles compétences",
      desc: "Développez votre expertise technique avec des formations axées sur la pratique.",
      color: "bg-blue-50 border-blue-100 text-blue-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 19.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13" />,
    },
    {
      title: "Apprentissage pratique",
      desc: "Mettez vos connaissances en application à travers des exercices et des projets concrets.",
      color: "bg-orange-50 border-orange-100 text-orange-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    },
    {
      title: "Parcours professionnalisants",
      desc: "Construisez un portfolio et développez des compétences utiles à vos projets professionnels.",
      color: "bg-purple-50 border-purple-100 text-purple-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />,
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-[#FAFAFA] pt-20 font-sans text-[#0F2137] antialiased">
      {/* 1. HERO */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:px-16">
        <div className="space-y-5 sm:space-y-6 lg:col-span-7">
          <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-[#0F2137] sm:text-4xl md:text-5xl">
            <span className="underline decoration-[#FF7A00] decoration-4 underline-offset-4">Développez vos compétences</span> avec nos formations intensives
          </h1>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500 md:text-base">
            Apprenez les technologies recherchées, développez vos compétences et préparez-vous aux métiers du numérique avec Ghostech Académie.
          </p>
          <form onSubmit={(event) => event.preventDefault()} className="flex max-w-md items-center rounded-xl border border-gray-100 bg-white p-1.5 shadow-md transition-all focus-within:ring-2 focus-within:ring-orange-200">
            <input type="search" aria-label="Rechercher une formation" placeholder="Que souhaitez-vous apprendre ?" value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 w-full bg-transparent px-3 py-2 text-xs text-gray-700 outline-none placeholder-gray-400 sm:text-sm" />
            <button type="submit" className="shrink-0 rounded-lg bg-[#FF7A00] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-700 sm:px-5">Rechercher</button>
          </form>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-gray-600 sm:gap-6">
            <span className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Projets pratiques</span>
            <span className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Formations dès 30 000 FCFA</span>
          </div>
        </div>
        <div className="flex justify-center py-4 lg:col-span-5">
          <div className="relative h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80">
            <div className="absolute inset-0 -translate-y-4 translate-x-4 rounded-full bg-[#F7C324]" />
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-white bg-slate-200 shadow-xl">
              <img src="/Galeries/img6.jpeg" alt="Apprenants en formation numérique" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 z-20 h-12 w-12 rounded-br-3xl rounded-tl-3xl bg-cyan-400 shadow-md sm:h-14 sm:w-14" />
            <div className="absolute -right-2 bottom-6 z-20 h-9 w-9 rounded-full bg-[#FF7A00] shadow-sm sm:h-10 sm:w-10" />
          </div>
        </div>
      </section>

      {/* 2. AVANTAGES */}
      <section className="relative z-10 mx-auto mb-16 grid w-full max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3 lg:px-16">
        {valueCards.map((card) => (
          <div key={card.title} className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${card.color}`}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{card.icon}</svg></div>
            <h2 className="mb-1.5 text-base font-bold text-[#0F2137]">{card.title}</h2>
            <p className="text-[13px] leading-relaxed text-gray-500">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. FORMATIONS DYNAMIQUES OU CATALOGUE COMPLET */}
      <section className="relative w-full overflow-hidden bg-[#022329] py-16 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-[5%] -top-[5%] z-0 h-[250px] w-[250px] text-[#39779e]/40 md:h-[450px] md:w-[450px]">
          <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-16">
          {filteredCourses.length > 0 ? (
            <>
              <div className="mb-8 text-center"><p className="text-sm text-slate-300">{normalizedSearch ? `${filteredCourses.length} résultat(s) pour « ${search} »` : "Découvrez nos formations disponibles"}</p></div>
              <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
              </div>
              <div className="mb-12 rounded-xl border border-white/20 bg-white/10 p-5 text-center">
                <p className="text-sm font-bold text-white">Vous souhaitez découvrir tous nos parcours de spécialisation ?</p>
                <button type="button" onClick={() => setSearch("")} className="mt-4 rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#022329] transition hover:bg-slate-100">Voir toutes les formations</button>
              </div>
            </>
          ) : (
            <>
              {normalizedSearch && <p className="mb-10 text-center text-sm text-slate-300">Aucun résultat exact pour « {search} ». Découvrez notre catalogue complet ci-dessous.</p>}
              <CatalogueFormations
                onSelectFormation={setSelectedFormation}
                onSelectParcours={setSelectedParcours}
              />
            </>
          )}
        </div>
      </section>

      <Partenaires />

      {/* 5. BANDEAUX DE FIN DE PAGE */}
      <section className="grid w-full grid-cols-1 border-t border-gray-100 md:grid-cols-2">
        <div className="group relative flex h-[400px] items-center overflow-hidden bg-slate-900 px-8 text-white lg:px-16">
          <img src="/Galeries/img.png" className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105" alt="Formation et apprentissage technologique" />
          <div className="relative z-10 max-w-sm space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Ghostech Académie</span>
            <h2 className="text-lg font-black leading-snug md:text-xl">Des formations pratiques pour développer vos compétences numériques.</h2>
            <a href={`mailto:${EMAIL_GHOSTECH}?subject=${encodeURIComponent("Informations sur les formations Ghostech")}`} className="inline-flex rounded-md bg-[#FF7A00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-700">Découvrir les formations</a>
          </div>
        </div>
        <div className="group relative flex h-[400px] items-center overflow-hidden bg-indigo-950 px-8 text-white lg:px-16">
          <img src="/Galeries/Haka/haka6.png" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105" alt="Prochaine session de formation" />
          <div className="relative z-10 max-w-sm space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Prochaine session</span>
            <h2 className="text-lg font-black leading-snug md:text-xl">Préparez votre prochain parcours et renseignez-vous sur les prochaines sessions.</h2>
            <a href={`mailto:${EMAIL_GHOSTECH}?subject=${encodeURIComponent("Prochaines sessions de formation Ghostech")}`} className="inline-flex rounded-md bg-[#FF7A00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-700">Recevoir les informations</a>
          </div>
        </div>
      </section>

      {/* Modal de détails */}
      <FormationModal
        formation={selectedFormation}
        onClose={() => setSelectedFormation(null)}
      />
      <ParcoursModal
        pack={selectedParcours}
        onClose={() => setSelectedParcours(null)}
      />
    </main>
  );
}