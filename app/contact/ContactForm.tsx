"use client";

import {
  useState,
  useRef,
  useMemo,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Partenaires from "@/src/composants/communs/Partenaires";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

type ContactLocation = {
  country: string;
  city: string;
  address: string;
  coordinates: [number, number];
  type: "headquarters" | "office";
  description?: string;
  phone?: string;
  email?: string;
  active?: boolean;
};

type FormStatus = "idle" | "loading" | "success" | "error";

/* ========================================================= */
/* DONNÉES */
/* ========================================================= */

const CONTACT_OPTIONS = [
  {
    icon: "mail",
    title: "Email",
    value: "ghostech92@gmail.com",
    description: "Pour toute demande générale, collaboration ou information.",
    href: "mailto:ghostech92@gmail.com",
  },
  {
    icon: "call",
    title: "Téléphone",
    value: "+225 05 56 13 02 45",
    description: "Échangez directement avec notre équipe.",
    href: "tel:+2250556130245",
  },
  {
    icon: "location_on",
    title: "Localisation",
    value: "Bonoumin, Abidjan, Côte d'Ivoire",
    description: "Une organisation technologique tournée vers l'Afrique.",
    href: "#localisation",
  },
] as const;

const CONTACT_REASONS = [
  {
    icon: "handshake",
    title: "Partenariat",
    description:
      "Vous souhaitez collaborer avec Ghostech ou développer une initiative commune ?",
    gradient: "from-[#F18A20]/20 to-[#F18A20]/5",
  },
  {
    icon: "lightbulb",
    title: "Projet & Innovation",
    description:
      "Vous avez une idée, un projet technologique ou une problématique à résoudre ?",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: "event",
    title: "Événement",
    description:
      "Vous souhaitez participer, intervenir ou devenir partenaire de nos événements ?",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: "groups",
    title: "Communauté",
    description:
      "Vous souhaitez rejoindre notre écosystème et contribuer à nos initiatives ?",
    gradient: "from-green-500/20 to-green-500/5",
  },
] as const;

const LOCATIONS: ContactLocation[] = [
  {
    country: "Côte d'Ivoire",
    city: "Abidjan",
    address: "Bonoumin, Abidjan",
    coordinates: [5.359952, -3.988875],
    type: "headquarters",
    description: "Siège principal - Hub technologique",
    phone: "+225 05 56 13 02 45",
    email: "ghostech92@gmail.com",
    active: true,
  },
  {
    country: "Togo",
    city: "Lomé",
    address: "Boulevard du 13 Janvier, Lomé",
    coordinates: [6.131944, 1.222778],
    type: "office",
    phone: "+228 90 00 00 00",
    email: "lome@ghostech.africa",
    active: true,
  },
  {
    country: "Bénin",
    city: "Cotonou",
    address: "Zone Résidentielle, Cotonou",
    coordinates: [6.36736, 2.4225],
    type: "office",
    phone: "+229 90 00 00 00",
    email: "cotonou@ghostech.africa",
    active: true,
  },
  {
    country: "Congo Brazzaville",
    city: "Brazzaville",
    address: "Centre-ville, Brazzaville",
    coordinates: [-4.26336, 15.242885],
    type: "office",
    phone: "+242 06 000 00 00",
    email: "brazzaville@ghostech.africa",
    active: true,
  },
];

const STATS = [
  { label: "Projets accompagnés", value: "8+" },
  { label: "Partenaires", value: "10+" },
  { label: "Pays présents", value: "4" },
] as const;

const FORM_HIGHLIGHTS = [
  {
    icon: "schedule",
    title: "Réponse rapide",
    desc: "Nous faisons notre possible pour répondre dans les meilleurs délais.",
  },
  {
    icon: "diversity_3",
    title: "Une équipe à votre écoute",
    desc: "Notre équipe vous accompagne selon la nature de votre demande.",
  },
  {
    icon: "verified",
    title: "100% confidentiel",
    desc: "Vos données sont sécurisées et jamais partagées.",
  },
] as const;

/* ========================================================= */
/* VARIANT FRAMER-MOTION RÉUTILISABLES */
/* ========================================================= */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24, delay: i * 0.08 },
  }),
};

/* ========================================================= */
/* STYLES PARTAGÉS */
/* ========================================================= */

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all duration-300 input-focus-ring";

/* ========================================================= */
/* COMPOSANT CARTE (Leaflet chargée dynamiquement) */
/* ========================================================= */

const CarteContact = dynamic(() => import("./ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center rounded-2xl border border-dashed border-[#F18A20]/40 bg-[#101820] text-sm text-white/60">
      <p className="font-semibold text-white animate-pulse">
        Chargement de la carte…
      </p>
    </div>
  ),
});

/* ========================================================= */
/* COMPOSANT PRINCIPAL */
/* ========================================================= */

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [selectedLocation, setSelectedLocation] = useState<ContactLocation>(
    LOCATIONS[0]
  );
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Particules mémoïsées (évite la régénération à chaque render)
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 61) % 100}%`,
        duration: 5 + (i % 5),
        delay: (i % 5) * 0.8,
      })),
    []
  );

  /* ------------------------------------------------------- */
  /* SOUMISSION DU FORMULAIRE */
  /* ------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    setStatus("loading");

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Échec de l'envoi");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  /* ------------------------------------------------------- */
  /* RENDU */
  /* ------------------------------------------------------- */

  return (
    <main className="w-full bg-white text-[#333333] overflow-hidden">
      {/* ===================================================== */}
      {/* STYLES GLOBAUX */}
      {/* ===================================================== */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 24px;
          background: #101820;
        }
        .leaflet-tile-pane {
          filter: saturate(0.9) contrast(1.04) brightness(0.9);
        }
        .ghostech-map-marker {
          border: 0;
          background: transparent;
        }
        .ghostech-map-marker__pin {
          position: relative;
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          background: #357dab;
          box-shadow: 0 5px 16px rgba(15, 24, 32, 0.4);
          transform: rotate(-45deg);
          transition: background 180ms ease, scale 180ms ease;
        }
        .ghostech-map-marker__pin > span {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: white;
          transform: rotate(45deg);
        }
        .ghostech-map-marker__pin.is-selected {
          z-index: 1;
          background: #f18a20;
          scale: 1.12;
        }
        .ghostech-map-marker__pin.is-selected::after {
          position: absolute;
          inset: -7px;
          border: 2px solid rgba(241, 138, 32, 0.6);
          border-radius: 50%;
          content: "";
          animation: map-marker-pulse 1.8s ease-out infinite;
        }
        @keyframes map-marker-pulse {
          from { opacity: 0.8; scale: 0.7; }
          to { opacity: 0; scale: 1.5; }
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(241, 138, 32, 0.35) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28) !important;
        }
        .leaflet-control-zoom a {
          background: #17232d !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: #f18a20 !important;
          transition: all 0.3s ease;
        }
        .leaflet-control-zoom a:hover {
          background: #1f2f3d !important;
          color: #ff9a30 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          background: #ffffff !important;
          color: #17232d !important;
          box-shadow: 0 14px 34px rgba(0,0,0,0.45);
          border: 1px solid rgba(241,138,32,0.2);
        }
        .leaflet-popup-tip { background: #ffffff !important; }
        .leaflet-popup-close-button { color: #17232d !important; }
        .leaflet-popup-content {
          padding: 16px 20px;
          font-family: inherit;
        }
        @media (prefers-reduced-motion: reduce) {
          .ghostech-map-marker__pin.is-selected::after {
            animation: none;
          }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb {
          background: #F18A20;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover { background: #c16014; }

        .input-focus-ring { transition: all 0.3s ease; }
        .input-focus-ring:focus {
          border-color: #F18A20;
          box-shadow: 0 0 0 4px rgba(241,138,32,0.12);
        }

        .glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-dark {
          background: rgba(16, 24, 32, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ===================================================== */}
      {/* HERO AVEC PARALLAX */}
      {/* ===================================================== */}

      <section
        ref={heroRef}
        className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden"
      >
        <motion.div
          style={{ y, opacity, backgroundImage: "url('/Galeries/img8.jpeg')" }}
          className="absolute inset-0 bg-cover bg-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F65]/90 via-[#1A1A1AEA]/80 to-[#F18A20]/30" />

        {/* Cercles décoratifs */}
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full border-[80px] border-[#F18A20]/10 animate-float" />
        <div className="absolute left-[10%] bottom-[-80px] w-[400px] h-[400px] rounded-full bg-[#F18A20]/5 blur-3xl" />
        <div className="absolute right-[20%] top-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl" />

        {/* Particules */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-1 h-1 bg-[#F18A20]/30 rounded-full"
                style={{ left: p.left, top: p.top }}
                initial={{ opacity: 0.2 }}
                animate={{
                  y: [null, -30, 30, -20, 20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-b612 text-5xl sm:text-6xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight"
            >
              Parlons de vos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F18A20] to-[#FFB347]">
                idées.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 text-white/70 text-base md:text-lg leading-relaxed max-w-2xl"
            >
              Une idée, un projet, une collaboration ou simplement l&apos;envie
              d&apos;échanger autour de la technologie ? L&apos;équipe Ghostech
              est à votre écoute.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#formulaire"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#F18A20] to-[#FFB347] hover:from-[#C16014] hover:to-[#E07A20] text-white px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#F18A20]/25"
              >
                Nous contacter
                <span
                  aria-hidden="true"
                  className="material-symbols-rounded text-[20px] group-hover:translate-x-1 transition-transform"
                >
                  arrow_forward
                </span>
              </a>

              <Link
                href="/a-propos"
                className="group inline-flex items-center gap-2 border border-white/20 hover:border-[#F18A20] text-white px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 hover:-translate-y-1"
              >
                Découvrir Ghostech
                <span
                  aria-hidden="true"
                  className="material-symbols-rounded text-[20px] group-hover:translate-x-1 transition-transform"
                >
                  chevron_right
                </span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-12 flex gap-8"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Mot décoratif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          aria-hidden="true"
          className="absolute right-[5%] bottom-[10%] hidden lg:block select-none pointer-events-none"
        >
          <span className="text-[180px] font-black text-white/[0.03] tracking-wider">
            GHOSTECH
          </span>
        </motion.div>
      </section>

      {/* ===================================================== */}
      {/* CONTACT RAPIDE - CARTES FLOTTANTES */}
      {/* ===================================================== */}

      <section className="relative z-20 -mt-16 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CONTACT_OPTIONS.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
              className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F18A20]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F18A20]/0 to-[#F18A20]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[#F18A20]/5 group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF4E8] to-[#FFE8D0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span
                    aria-hidden="true"
                    className="material-symbols-rounded text-3xl text-[#F18A20] group-hover:scale-110 transition-transform"
                  >
                    {item.icon}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.15em] font-bold text-[#F18A20] mb-2">
                  {item.title}
                </p>

                <h3 className="text-base font-bold text-[#333333] mb-2 group-hover:text-[#F18A20] transition-colors">
                  {item.value}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ===================================================== */}
      {/* FORMULAIRE */}
      {/* ===================================================== */}

      <section
        id="formulaire"
        className="w-full py-32 px-6 bg-gradient-to-b from-white to-[#F9FAFC]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-20 items-start">
          {/* Texte gauche */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-b612 text-4xl md:text-5xl font-bold text-[#333333] leading-[1.1] mt-6">
              Une question ?
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F18A20] to-[#FFB347]">
                Un projet ?
              </span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mt-6 max-w-md">
              Remplissez le formulaire et présentez-nous votre besoin. Notre
              équipe prendra le temps d&apos;étudier votre demande et de revenir
              vers vous.
            </p>

            <div className="mt-12 space-y-6">
              {FORM_HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF4E8] to-[#FFE8D0] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span
                      aria-hidden="true"
                      className="material-symbols-rounded text-2xl text-[#F18A20]"
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#333333] group-hover:text-[#F18A20] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate={false}
              className="relative bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_80px_rgba(241,138,32,0.12)] transition-shadow duration-500"
            >
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-[#F18A20]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-gradient-to-tr from-[#F18A20]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Nom complet{" "}
                      <span aria-hidden="true" className="text-[#F18A20]">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      aria-required="true"
                      placeholder="Votre nom"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Email{" "}
                      <span aria-hidden="true" className="text-[#F18A20]">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      aria-required="true"
                      placeholder="vous@email.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-country"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Pays
                    </label>
                    <select
                      id="contact-country"
                      name="country"
                      className={`${inputClass} text-gray-600 appearance-none cursor-pointer`}
                    >
                      <option value="">Sélectionnez votre pays</option>
                      <option value="ci">Côte d&apos;Ivoire</option>
                      <option value="tg">Togo</option>
                      <option value="bj">Bénin</option>
                      <option value="cg">Congo Brazzaville</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Objet{" "}
                      <span aria-hidden="true" className="text-[#F18A20]">
                        *
                      </span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      aria-required="true"
                      className={`${inputClass} text-gray-600 appearance-none cursor-pointer`}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="projet">Projet / Innovation</option>
                      <option value="evenement">Événement</option>
                      <option value="communaute">Communauté</option>
                      <option value="formation">Formation</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-bold text-[#333333] mb-2"
                    >
                      Votre message{" "}
                      <span aria-hidden="true" className="text-[#F18A20]">
                        *
                      </span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      aria-required="true"
                      rows={5}
                      placeholder="Décrivez votre demande..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none outline-none transition-all duration-300 input-focus-ring min-h-[120px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      aria-busy={status === "loading"}
                      aria-live="polite"
                      whileHover={status === "loading" ? undefined : { scale: 1.02 }}
                      whileTap={status === "loading" ? undefined : { scale: 0.98 }}
                      className="group w-full h-14 rounded-xl bg-gradient-to-r from-[#F18A20] to-[#FFB347] hover:from-[#C16014] hover:to-[#E07A20] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-[#F18A20]/20 hover:shadow-xl hover:shadow-[#F18A20]/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F18A20]/40"
                    >
                      {status === "loading" ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded animate-spin text-xl"
                          >
                            progress_activity
                          </span>
                          Envoi en cours...
                        </>
                      ) : status === "success" ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-xl"
                          >
                            check_circle
                          </span>
                          Message envoyé !
                        </>
                      ) : (
                        <>
                          Envoyer mon message
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-xl group-hover:translate-x-1 transition-transform"
                          >
                            arrow_forward
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        role="status"
                        className="sm:col-span-2 bg-green-50 border border-green-100 rounded-xl p-4"
                      >
                        <p className="text-green-700 text-sm flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-lg"
                          >
                            check_circle
                          </span>
                          Votre message a bien été envoyé. Merci d&apos;avoir
                          contacté Ghostech.
                        </p>
                      </motion.div>
                    )}

                    {status === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        role="alert"
                        className="sm:col-span-2 bg-red-50 border border-red-100 rounded-xl p-4"
                      >
                        <p className="text-red-700 text-sm flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-lg"
                          >
                            error
                          </span>
                          Une erreur est survenue. Merci de réessayer ou de nous
                          écrire directement.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* POURQUOI NOUS CONTACTER */}
      {/* ===================================================== */}

      <section className="w-full bg-[#F9FAFC] border-y border-gray-100 py-28 px-6 relative overflow-hidden">
        <div className="absolute -right-40 top-0 w-[500px] h-[500px] bg-[#F18A20]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-40 bottom-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="font-b612 text-4xl md:text-5xl font-bold text-[#333333] mt-6">
              Comment pouvons-nous
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F18A20] to-[#FFB347]">
                avancer ensemble ?
              </span>
            </h2>
            <p className="text-gray-500 text-base mt-5 leading-relaxed">
              Ghostech rassemble des talents, des technologies et des
              initiatives autour d&apos;une ambition commune : contribuer à
              construire un écosystème technologique africain plus innovant.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CONTACT_REASONS.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`relative bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-500 overflow-hidden group cursor-pointer ${
                  hoveredCard === index
                    ? "shadow-2xl border-[#F18A20]/30"
                    : "shadow-lg"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#F18A20]/5 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#333333] to-[#1a1a1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span
                      aria-hidden="true"
                      className="material-symbols-rounded text-2xl text-[#F18A20]"
                    >
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#333333] text-lg mb-3 group-hover:text-[#F18A20] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* LOCALISATION */}
      {/* ===================================================== */}

      <section
        id="localisation"
        className="w-full py-28 px-6 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#F18A20]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <h2 className="font-b612 text-4xl md:text-5xl font-bold text-[#333333] mt-6">
              Ghostech en
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F18A20] to-[#FFB347]">
                {" "}
                Afrique
              </span>
            </h2>
            <p className="text-gray-500 text-base mt-5 max-w-2xl mx-auto">
              Une présence active dans plusieurs pays pour accompagner les
              talents et les projets technologiques à travers le continent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.35fr_1.65fr] gap-8">
            {/* Liste des bureaux */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-3"
              aria-label="Choisir une implantation Ghostech"
            >
              <p className="px-1 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                Nos implantations
              </p>
              {LOCATIONS.map((location) => {
                const isSelected = selectedLocation.country === location.country;
                return (
                  <motion.button
                    key={location.country}
                    type="button"
                    onClick={() => setSelectedLocation(location)}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    aria-pressed={isSelected}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F18A20]/30 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#333333] to-[#1a1a1a] border-[#333333] shadow-xl"
                        : "bg-white border-gray-200 hover:border-[#F18A20] hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          location.type === "headquarters"
                            ? "bg-gradient-to-br from-[#F18A20] to-[#FFB347]"
                            : "bg-gradient-to-br from-green-500 to-green-600"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-rounded text-white text-2xl"
                        >
                          {location.type === "headquarters" ? "home" : "business"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-bold text-sm ${
                            isSelected ? "text-white" : "text-[#333333]"
                          }`}
                        >
                          {location.country}
                        </h3>
                        <p
                          className={`text-xs ${
                            isSelected ? "text-white/60" : "text-gray-500"
                          }`}
                        >
                          {location.city}
                        </p>
                        {location.description && (
                          <p
                            className={`mt-1 text-[11px] leading-relaxed ${
                              isSelected ? "text-white/45" : "text-gray-400"
                            }`}
                          >
                            {location.description}
                          </p>
                        )}
                      </div>
                      {location.type === "headquarters" && (
                        <span className="text-[10px] font-bold bg-[#F18A20] text-white px-3 py-1 rounded-full">
                          Siège
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Carte */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              role="region"
              aria-label="Carte interactive des implantations Ghostech"
              className="rounded-3xl overflow-hidden relative min-h-[560px] lg:min-h-[620px] bg-[#101820] border border-[#F18A20]/20 shadow-[0_20px_60px_rgba(15,24,32,0.25)]"
            >
              <div className="absolute top-4 left-4 z-[401] flex items-center gap-3 rounded-full border border-white/15 bg-[#101820]/90 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md pointer-events-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF50]" />
                </span>
                Réseau Ghostech <span className="text-white/40">·</span> 04 hubs
              </div>

              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 right-4 z-[401] rounded-full border border-white/15 bg-[#101820]/90 px-3 py-2 text-[10px] font-medium text-white/75 shadow-lg backdrop-blur-md transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F18A20]"
              >
                © OpenStreetMap
              </a>

              <CarteContact
                locations={LOCATIONS}
                onSelect={setSelectedLocation}
                selected={selectedLocation}
              />

              {/* Overlay info */}
              <motion.div
                key={selectedLocation.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-[min(36rem,calc(100%-2rem))] z-[401] bg-[#101820]/95 border border-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_16px_35px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F18A20] to-[#FFB347] flex items-center justify-center shrink-0">
                    <span
                      aria-hidden="true"
                      className="material-symbols-rounded text-white text-xl"
                    >
                      {selectedLocation.type === "headquarters"
                        ? "home"
                        : "location_on"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFB347]">
                      {selectedLocation.type === "headquarters"
                        ? "Siège Ghostech"
                        : "Bureau Ghostech"}
                    </p>
                    <h3 className="mt-1 font-bold text-sm text-white">
                      {selectedLocation.city}, {selectedLocation.country}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      {selectedLocation.address}
                    </p>
                    {selectedLocation.description && (
                      <p className="mt-1 text-xs text-white/45">
                        {selectedLocation.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                      {selectedLocation.phone && (
                        <a
                          href={`tel:${selectedLocation.phone.replace(/\s/g, "")}`}
                          className="text-xs text-white/70 hover:text-[#FFB347] transition-colors flex items-center gap-1.5"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-[16px]"
                          >
                            call
                          </span>
                          {selectedLocation.phone}
                        </a>
                      )}
                      {selectedLocation.email && (
                        <a
                          href={`mailto:${selectedLocation.email}`}
                          className="text-xs text-white/70 hover:text-[#FFB347] transition-colors flex items-center gap-1.5"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-rounded text-[16px]"
                          >
                            mail
                          </span>
                          {selectedLocation.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.coordinates.join(","))}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Itinéraire vers ${selectedLocation.city}, ${selectedLocation.country}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white/10 p-3 text-white transition-colors hover:bg-[#F18A20] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB347]"
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-rounded text-xl"
                    >
                      directions
                    </span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Partenaires />

      {/* ===================================================== */}
      {/* CTA FINAL */}
      {/* ===================================================== */}

      <section className="w-full pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F9FAFC] to-white" />
        <div className="absolute -left-40 bottom-0 w-[500px] h-[500px] bg-[#F18A20]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-40 top-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="relative inline-block mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-[#F18A20] to-[#FFB347] rounded-full mx-auto" />
            <div className="absolute -inset-4 bg-[#F18A20]/10 rounded-full blur-xl animate-pulse-ring" />
          </div>

          <h2 className="font-b612 text-4xl md:text-6xl font-bold text-[#333333] leading-[1.1]">
            Construisons quelque chose
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F18A20] to-[#FFB347]">
              d&apos;impactant.
            </span>
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto mt-6 text-base leading-relaxed">
            Chez Ghostech, nous croyons que la technologie prend tout son sens
            lorsqu&apos;elle répond aux besoins réels de notre société.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-10"
          >
            <Link
              href="#formulaire"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#333333] to-[#1a1a1a] hover:from-[#F18A20] hover:to-[#FFB347] text-white px-10 py-4 rounded-xl text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#F18A20]/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F18A20]/40"
            >
              Démarrer une conversation
              <span
                aria-hidden="true"
                className="material-symbols-rounded text-xl group-hover:translate-x-1 transition-transform"
              >
                arrow_forward
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}