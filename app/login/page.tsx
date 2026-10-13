"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/services/firebase";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#02073E]/10 bg-slate-50/70 shadow-sm transition-all duration-200 focus-within:border-[#357dab] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#357dab]/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex w-72 items-start gap-3 rounded-2xl border border-white/30 bg-white/15 p-4 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-white/20`}>
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white">
      <Image src={testimonial.avatarSrc} fill sizes="48px" className="object-cover" alt={testimonial.name} />
    </div>
    <div className="text-sm leading-snug text-white">
      <p className="flex items-center gap-1 font-bold">{testimonial.name}</p>
      <p className="text-white/80 text-xs">{testimonial.handle}</p>
      <p className="mt-1 text-white text-xs line-clamp-2">{testimonial.text}</p>
    </div>
  </div>
);

function getDashboardRedirectPath() {
  const nextPath = new URLSearchParams(window.location.search).get("next");
  return nextPath?.startsWith("/dashboard/") || nextPath === "/dashboard"
    ? nextPath
    : "/dashboard";
}

// --- MAIN COMPONENT ---

export default function LoginPage() {
  const reducedMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // cspell:disable
  const testimonials: Testimonial[] = [
    {
      name: "Amira Touré",
      handle: "@amirat",
      avatarSrc: "/Rejoindre_aventure/r1.jpg",
      text: "Rejoindre Ghostech a complètement transformé ma façon de coder et de voir l'innovation en Afrique.",
    },
    {
      name: "Koffi Stéphane",
      handle: "@stephkoffi",
      avatarSrc: "/Rejoindre_aventure/r2.jpeg",
      text: "Une communauté incroyable, toujours là pour s'entraider sur les projets tech les plus fous !",
    },
    {
      name: "Inès B.",
      handle: "@ines_dev",
      avatarSrc: "/Rejoindre_aventure/r3.jpg",
      text: "Des formations de qualité et une vraie ambiance startup. Le meilleur choix de mon année.",
    },
  ];
  // cspell:enable

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!auth || !db) {
      setError("L'authentification Firebase n'est pas configurée.");
      return;
    }

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data to check role and redirect accordingly
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists() && ["admin", "organisateur"].includes(userDoc.data().role)) {
        router.push(getDashboardRedirectPath());
      } else {
        router.push('/');
      }
    } catch (error: unknown) {
      console.error("FIREBASE ERROR:", error);
      let errorMessage = "Identifiants invalides ou erreur de connexion.";
      if (
        error instanceof FirebaseError &&
        ["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(error.code)
      ) {
        errorMessage = "Email ou mot de passe incorrect.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
      setError("L'authentification Firebase n'est pas configurée.");
      return;
    }

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Ensure user document exists in firestore
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          name: result.user.displayName || "Utilisateur",
          email: result.user.email,
          role: "utilisateur",
          points: 0,
          level: "Beginner",
          createdAt: new Date()
        });
      }

      const role = userDoc.exists() ? userDoc.data().role : "utilisateur";
      if (role === "admin" || role === "organisateur") {
        router.push(getDashboardRedirectPath());
      } else {
        router.push('/');
      }
    } catch (error: unknown) {
      console.error(error);
      setError("Erreur lors de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#F4F7FB] font-sans md:flex-row">
      
      {/* Left column: sign-in form */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-white px-5 py-12 sm:px-8 md:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#357dab]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#fd800a]/10 blur-3xl" />
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.55, ease: "easeOut" }}
          className="relative z-10 mt-8 w-full max-w-md md:mt-0"
        >
          <div className="mb-8 flex flex-col items-center">
            <Image src="/logo1.svg" alt="Ghostech Logo" width={160} height={48} priority className="mb-6 h-12 w-auto drop-shadow-sm" />
          </div>

          <div className="flex flex-col gap-6 rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-9">
            <div className="text-center">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#357dab]">
                Votre espace Ghostech
              </p>
              <h1 className="mb-2 font-b612 text-3xl font-bold leading-tight text-[#02073E] md:text-4xl">
                Bon retour parmi nous
              </h1>
              <p className="text-sm leading-6 text-slate-500">Connectez-vous pour accéder à votre espace membre</p>
            </div>

            {error && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#02073E]">Adresse e-mail</label>
                <GlassInputWrapper>
                  <div className="flex items-center gap-3 px-4">
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400 transition-colors" />
                    <input id="login-email" name="email" type="email" autoComplete="email" placeholder="Entrez votre adresse e-mail" className="w-full bg-transparent py-3.5 text-sm text-[#02073E] outline-none placeholder:text-slate-400" required />
                  </div>
                </GlassInputWrapper>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-sm font-semibold text-[#02073E]">Mot de passe</label>
                  <a href="#" className="text-xs font-semibold text-[#357dab] transition-colors hover:text-[#02073E] hover:underline">Mot de passe oublié ?</a>
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <div className="flex items-center gap-3 px-4">
                      <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
                      <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Entrez votre mot de passe" className="w-full bg-transparent py-3.5 pr-10 text-sm text-[#02073E] outline-none placeholder:text-slate-400" required />
                    </div>
                    <button type="button" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center rounded-lg px-1 text-gray-400 transition-colors hover:text-[#357dab] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#357dab]">
                      {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <button type="submit" disabled={loading} className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#357dab] py-4 font-bold text-white shadow-lg shadow-[#357dab]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#02073E] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#357dab] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                {loading ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Connexion en cours...</> : <>Se connecter <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}
              </button>
            </form>

            <div className="relative my-2 flex items-center justify-center">
              <span className="w-full border-t border-slate-200"></span>
              <span className="absolute bg-white px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Ou continuer avec</span>
            </div>

            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-4 font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#357dab] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50">
                <GoogleIcon />
                {loading ? "Veuillez patienter..." : "Se connecter avec Google"}
            </button>

            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Nouveau sur Ghostech ? <Link href="/register" className="font-bold text-[#357dab] transition-colors hover:text-[#02073E] hover:underline">Créer un compte</Link>
            </p>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-medium text-slate-400">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#357dab]" />
              Connexion sécurisée par Ghostech
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="relative hidden flex-1 bg-[#F4F7FB] p-4 md:flex">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98, x: 18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.08, ease: "easeOut" }}
          className="relative min-h-170 w-full overflow-hidden rounded-[2rem] bg-[#02073E] shadow-2xl"
        >
          {/* Overlay gradient over the image */}
          <div className="absolute inset-0 z-10 bg-linear-to-t from-[#02073E]/95 via-[#02073E]/35 to-[#02073E]/10"></div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(53,125,171,0.35),transparent_35%)]" />
          
          <div
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('/Galeries/imag2.jpeg')` }}
          ></div>

          {/* Slogan Text */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.3 }}
            className="absolute left-8 right-8 top-10 z-20 text-white lg:left-12 lg:right-12 lg:top-12"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#ffb36a] backdrop-blur-md"><Sparkles aria-hidden="true" size={14} /> Ghostech · Communauté tech</p>
            <h2 className="mb-4 font-b612 text-4xl font-bold leading-tight shadow-sm lg:text-5xl">Créez l&apos;avenir avec nous.</h2>
            <p className="max-w-md text-base leading-7 text-white/80 lg:text-lg">Développez des solutions innovantes et participez aux projets les plus ambitieux de l&apos;écosystème numérique africain.</p>
          </motion.div>

          <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-2 rounded-full border border-white/20 bg-[#02073E]/35 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-lg xl:flex">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#ffb36a]" />
            Un espace pour apprendre et collaborer
          </div>

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-0 right-0 z-20 flex w-full flex-wrap justify-center gap-4 px-8">
              {testimonials.slice(0, 2).map((testimonial, index) => (
                <div
                  key={testimonial.handle}
                  className={index === 1 ? "hidden xl:flex" : "flex"}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    delay={index === 0 ? "animate-delay-100" : "animate-delay-300"}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

    </div>
  );
}
