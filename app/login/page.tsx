"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/services/firebase";

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
  <div className="rounded-2xl border border-[#02073E]/10 bg-white shadow-sm transition-colors focus-within:border-[#357dab] focus-within:ring-2 focus-within:ring-[#357dab]/20">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-4 w-72 shadow-lg`}>
    <img src={testimonial.avatarSrc} className="h-12 w-12 object-cover rounded-full border-2 border-white" alt={testimonial.name} />
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    }
  ];

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
    <div className="min-h-dvh flex flex-col md:flex-row font-sans w-full bg-gray-50">
      
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md mt-12 md:mt-0">
          <div className="flex flex-col items-center mb-8">
             <img src="/logo1.svg" alt="Ghostech Logo" className="h-12 w-auto mb-6" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-b612 font-bold text-[#02073E] leading-tight mb-2">
                Bon retour parmi nous
              </h1>
              <p className="text-gray-500">Connectez-vous pour accéder à votre espace membre</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <label className="text-sm font-medium text-[#02073E] mb-1 block">Adresse Email</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Entrez votre adresse email" className="w-full bg-transparent text-[#02073E] text-sm p-3.5 rounded-2xl focus:outline-none" required />
                </GlassInputWrapper>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-[#02073E] block">Mot de passe</label>
                  <a href="#" className="text-xs font-medium text-[#357dab] hover:underline">Mot de passe oublié ?</a>
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Entrez votre mot de passe" className="w-full bg-transparent text-[#02073E] text-sm p-3.5 pr-12 rounded-2xl focus:outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#357dab]">
                      <span className="material-symbols-rounded text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#357dab] py-4 font-bold text-white hover:bg-[#02073E] hover:shadow-lg transition-all duration-300 mt-2 disabled:opacity-50">
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <div className="relative flex items-center justify-center mt-2 mb-2">
              <span className="w-full border-t border-gray-200"></span>
              <span className="px-4 text-sm text-gray-400 bg-white absolute font-medium">Ou continuer avec</span>
            </div>

            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-2xl py-4 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm disabled:opacity-50">
                <GoogleIcon />
                Se connecter avec Google
            </button>

            <p className="text-center text-sm text-gray-500 font-medium mt-4">
              Nouveau sur Ghostech ? <Link href="/register" className="text-[#357dab] hover:underline transition-colors font-bold">Créer un compte</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="hidden md:flex flex-1 relative p-4 bg-gray-50">
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Overlay gradient over the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02073E]/90 via-[#02073E]/40 to-transparent z-10"></div>
          
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('/header_photo/h1.svg')` }}
          ></div>

          {/* Slogan Text */}
          <div className="absolute top-12 left-12 right-12 z-20 text-white">
            <h2 className="text-4xl font-b612 font-bold leading-tight mb-4 shadow-sm">Créez l&apos;avenir avec nous.</h2>
            <p className="text-white/80 text-lg max-w-md">Développez des solutions innovantes et participez aux projets les plus ambitieux de l&apos;écosystème numérique africain.</p>
          </div>

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-wrap gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-100" />
              <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-300" /></div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
