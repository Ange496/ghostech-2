"use client";

import { useState, FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, User, Briefcase, Heart, ClipboardCheck, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function RejoindreEquipe() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Étape 1 : Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    // Étape 2 : Profil professionnel
    statut: "Étudiant",
    etablissement: "",
    domaine: "Développement Web / Mobile",
    niveau: "Débutant",
    portfolio: "",
    // Étape 3 : Motivation et engagement
    motivation: "",
    contribution: "En participant aux projets",
    disponibilite: "2 à 5h / semaine",
    source: "Réseaux sociaux",
    consentement: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Candidature Ghostech reçue :", formData);
    setSubmitted(true);
  };

  // Validation par étape
  const isStepValid = () => {
    if (step === 1) return formData.firstName && formData.lastName && formData.email && formData.phone && formData.country && formData.city;
    if (step === 2) return formData.statut && formData.domaine && formData.niveau;
    if (step === 3) return formData.motivation && formData.contribution && formData.disponibilite && formData.source && formData.consentement;
    return true;
  };

  const stepTitles = [
    { title: "Informations personnelles", subtitle: "Faisons connaissance !", icon: User },
    { title: "Profil professionnel", subtitle: "Parlez-nous de votre parcours.", icon: Briefcase },
    { title: "Motivation & engagement", subtitle: "Ce qui vous anime chez Ghostech.", icon: Heart },
    { title: "Confirmation", subtitle: "Vérifiez vos informations.", icon: ClipboardCheck },
  ];

  const SLOGAN = "Innovation, impact, collaboration, apprentissage, excellence, engagement africain : ce sont nos valeurs.";

  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden bg-[#F6F8FB] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#fd800a]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="mx-auto w-full max-w-4xl">

        {/* En-tête avec slogan */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.55 }}
          className="mb-10 text-center sm:mb-12"
        >
          <h1 className="font-b612 mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            Rejoindre <span className="text-[#fd800a]">l&apos;équipe</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {SLOGAN}
          </p>
        </motion.div>

        {/* Stepper horizontal avec icônes */}
        <div className="mb-8 flex items-center justify-between px-1 sm:mb-10">
          {[1, 2, 3, 4].map((num, index) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div className={`relative grid place-items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all duration-500 shrink-0 ${
                step === num
                  ? "bg-[#fd800a] text-white shadow-lg shadow-[#fd800a]/30 scale-105 sm:scale-110"
                  : step > num
                  ? "bg-[#fd800a] text-white"
                  : "bg-white border-2 border-zinc-200 text-zinc-400"
              }`}>
                {step > num ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : num}
              </div>
              {index < totalSteps - 1 && (
                <div className="relative mx-1.5 h-1 flex-1 overflow-hidden rounded-full bg-slate-200 sm:mx-3">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-[#fd800a]"
                    initial={false}
                    animate={{ width: step > num ? "100%" : "0%" }}
                    transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Carte du formulaire */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.08 }}
          className="w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.09)]"
        >
          <div className="h-1.5 w-full bg-linear-to-r from-[#fd800a] via-[#FDBA74] to-[#fd800a]" />
          <div className="p-6 sm:p-10">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              {/* Titre de l'étape avec icône */}
              <div className="mb-8 flex items-center gap-4 rounded-2xl bg-slate-50/80 p-4 sm:p-5">
                <motion.div
                  key={step}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.85, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fd800a]/10 text-[#fd800a] ring-1 ring-[#fd800a]/10"
                >
                  {(() => {
                    const Icon = stepTitles[step - 1].icon;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">{stepTitles[step - 1].title}</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">{stepTitles[step - 1].subtitle}</p>
                </div>
                <span className="ml-auto hidden text-xs font-bold uppercase tracking-wider text-slate-400 sm:block">
                  Étape {step} / {totalSteps}
                </span>
              </div>

              {/* ÉTAPE 1 : Informations personnelles */}
              {step === 1 && (
                <motion.div
                  key="personal-info"
                  initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                        placeholder="Ex : Jérémy"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                        placeholder="Ex : Beh"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="Ex : votre.email@exemple.com"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Numéro de téléphone (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                      placeholder="Ex : +225 07 00 00 00 00"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Pays <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="country" required value={formData.country} onChange={handleChange}
                        placeholder="Ex : Côte d'Ivoire"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange}
                        placeholder="Ex : Abidjan"
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ÉTAPE 2 : Profil professionnel */}
              {step === 2 && (
                <motion.div
                  key="professional-profile"
                  initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Statut actuel <span className="text-red-500">*</span>
                      </label>
                      <select name="statut" value={formData.statut} onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                        <option value="Étudiant">Étudiant</option>
                        <option value="Développeur junior">Développeur junior</option>
                        <option value="Professionnel">Professionnel</option>
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Designer">Designer</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Niveau d&apos;expérience <span className="text-red-500">*</span>
                      </label>
                      <select name="niveau" value={formData.niveau} onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Établissement ou Entreprise <span className="text-zinc-400 text-xs">(Optionnel)</span>
                    </label>
                    <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange}
                      placeholder="Ex : IUA, universités locales, entreprise..."
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Domaine d&apos;expertise / Compétences techniques <span className="text-red-500">*</span>
                    </label>
                    <select name="domaine" value={formData.domaine} onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                      <option value="Développement Web / Mobile">Développement Web / Mobile (Frontend, Backend...)</option>
                      <option value="Intelligence Artificielle / Data Science">Intelligence Artificielle / Data Science</option>
                      <option value="Internet des Objets (IoT) / Électronique">Internet des Objets (IoT) / Électronique</option>
                      <option value="UI/UX Design / Infographie">UI/UX Design / Infographie</option>
                      <option value="Marketing digital / Création de contenu">Marketing digital / Création de contenu</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Portfolio / LinkedIn / GitHub <span className="text-zinc-400 text-xs">(Optionnel)</span>
                    </label>
                    <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange}
                      placeholder="Ex : https://linkedin.com/in/votre-profil"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition" />
                  </div>
                </motion.div>
              )}

              {/* ÉTAPE 3 : Motivation & engagement */}
              {step === 3 && (
                <motion.div
                  key="motivation"
                  initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Pourquoi souhaitez-vous rejoindre Ghostech ? <span className="text-red-500">*</span>
                    </label>
                    <textarea name="motivation" required rows={4} value={formData.motivation} onChange={handleChange}
                      placeholder="Réseautage, mentorat, participation à des hackathons, projets open source..."
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition resize-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Comment contribuer ? <span className="text-red-500">*</span>
                      </label>
                      <select name="contribution" value={formData.contribution} onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                        <option value="En participant aux projets">En participant aux projets</option>
                        <option value="En tant que formateur / mentor">En tant que formateur / mentor</option>
                        <option value="En partageant du contenu ou en participant aux événements">Partage de contenu / événements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Disponibilité hebdomadaire <span className="text-red-500">*</span>
                      </label>
                      <select name="disponibilite" value={formData.disponibilite} onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                        <option value="Moins de 2h / semaine">Moins de 2h / semaine</option>
                        <option value="2 à 5h / semaine">2 à 5h / semaine</option>
                        <option value="5 à 10h / semaine">5 à 10h / semaine</option>
                        <option value="Plus de 10h / semaine">Plus de 10h / semaine</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Comment avez-vous connu Ghostech ? <span className="text-red-500">*</span>
                    </label>
                    <select name="source" value={formData.source} onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#fd800a] focus:ring-2 focus:ring-[#fd800a]/10 transition cursor-pointer">
                      <option value="Réseaux sociaux">Réseaux sociaux (Instagram, LinkedIn, TikTok)</option>
                      <option value="Bouche à oreille">Bouche à oreille</option>
                      <option value="Événement / Conférence">Événement / Conférence</option>
                      <option value="Recherche Google">Recherche Google</option>
                      <option value="École / Université">École / Université</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Consentement RGPD */}
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-zinc-200 hover:border-[#fd800a]/40 transition-colors bg-zinc-50/50">
                    <input
                      type="checkbox"
                      name="consentement"
                      checked={formData.consentement}
                      onChange={handleChange}
                      required
                      className="mt-0.5 w-4 h-4 accent-[#fd800a] cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-zinc-600 leading-relaxed">
                      J&apos;accepte que mes données soient utilisées par Ghostech pour être contacté, intégrer les groupes de communication et recevoir la newsletter. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </motion.div>
              )}

              {/* ÉTAPE 4 : Confirmation */}
              {step === 4 && (
                <motion.div
                  key="confirmation"
                  initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className="space-y-5"
                >
                  <p className="text-sm text-zinc-500 mb-4">
                    Vérifiez vos informations avant l&apos;envoi de votre candidature.
                  </p>

                  <div className="rounded-xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
                    {[
                      { label: "Nom complet", value: `${formData.firstName} ${formData.lastName}` },
                      { label: "Email", value: formData.email },
                      { label: "Téléphone (WhatsApp)", value: formData.phone },
                      { label: "Localisation", value: `${formData.city}, ${formData.country}` },
                      { label: "Statut actuel", value: formData.statut },
                      { label: "Niveau d'expérience", value: formData.niveau },
                      { label: "Établissement / Entreprise", value: formData.etablissement || "Non renseigné" },
                      { label: "Domaine d'expertise", value: formData.domaine },
                      { label: "Portfolio", value: formData.portfolio || "Non renseigné", isLink: true },
                      { label: "Contribution souhaitée", value: formData.contribution },
                      { label: "Disponibilité", value: formData.disponibilite },
                      { label: "Source", value: formData.source },
                      { label: "Motivation", value: formData.motivation },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.label}</span>
                        {item.isLink && item.value !== "Non renseigné" ? (
                          <a href={item.value} target="_blank" rel="noreferrer"
                            className="text-sm text-[#fd800a] font-medium hover:underline inline-flex items-center gap-1 sm:text-right sm:max-w-[60%] wrap-break-word">
                            {item.value}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-sm text-[#111111] font-medium sm:text-right sm:max-w-[60%] wrap-break-word">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Boutons Previous / Next avec validation */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                {step > 1 ? (
                  <button type="button" onClick={prevStep}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a]">
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                ) : <div />}

                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} disabled={!isStepValid()}
                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow-md hover:-translate-y-0.5 ${
                      isStepValid()
                        ? "bg-[#fd800a] text-white hover:brightness-95 shadow-[#fd800a]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a] focus-visible:ring-offset-2"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                    }`}>
                    Suivant <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#fd800a] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#fd800a]/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fd800a] focus-visible:ring-offset-2">
                    Valider ma candidature 🚀
                  </button>
                )}
              </div>
            </form>
          ) : (
            // ÉCRAN DE SUCCÈS
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.35 }}
              className="space-y-4 py-12 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fd800a]/10 text-[#fd800a] ring-8 ring-[#fd800a]/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#111111]">Bienvenue dans la communauté !</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
                Félicitations <span className="font-semibold text-[#111111]">{formData.firstName}</span> ! Ton dossier a bien été transmis. L&apos;équipe Ghostech va l&apos;étudier avec attention.
              </p>
              <button type="button" onClick={() => { setSubmitted(false); setStep(1); }}
                className="text-xs text-[#fd800a] hover:underline font-semibold pt-4 block mx-auto">
                Soumettre un autre profil
              </button>
            </motion.div>
          )}
          </div>
        </motion.div>

      </div>
    </main>
  );
}