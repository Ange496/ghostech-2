
"use client";

import Image from "next/image";

export default function LoaderGhostech() {
  const words = [
    "Ghostech",
    "Construire",
    "Impacter",
    "Conquérir",
    "Ghostech",
  ];

  const loadingDuration = "180s";

  return (
    <main
      className="fixed inset-0 z-[9999] flex min-h-screen
        items-center justify-center overflow-hidden bg-white px-6
        font-sans text-black"
      role="status"
      aria-label="Chargement de Ghostech en cours"
    >
      {/* Décoration d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32
          h-80 w-80 rounded-full bg-orange-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32
          h-80 w-80 rounded-full bg-orange-50 blur-3xl"
      />

      <div className="relative flex w-full max-w-md flex-col items-center">
        {/* Logo animé */}
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full
            border-2 border-orange-100 border-t-[#fd800a]"
            style={{ animationDuration: "2.5s" }}
          />

          <div className="absolute inset-2 rounded-full border border-orange-200/70" />

          <div className="relative flex h-[76px] w-[76px] items-center
            justify-center overflow-hidden rounded-2xl bg-white p-2
            shadow-lg shadow-orange-500/10">
            <Image
              src="/partenaire/logo_ghostech.png"
              alt="Ghostech"
              width={76}
              height={76}
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Identité Ghostech */}
        <h1 className="text-2xl font-black tracking-[0.22em]">
          GHOST<span className="text-[#fd800a]">ECH</span>
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          La tech, pour tous, en Afrique.
        </p>

        {/* Animation des mots */}
        <div className="mt-9 flex h-11 items-center justify-center
          text-xl font-medium sm:text-2xl">
          <span className="mr-2 text-gray-500">On prépare :</span>

          <div className="relative h-10 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10
                bg-gradient-to-b from-white via-transparent
                via-30% to-white to-90%"
            />

            <div
              className="animate-loader-words"
              aria-hidden="true"
            >
              {words.map((word, index) => (
                <span
                  className="block h-10 whitespace-nowrap pl-1
                    font-bold leading-10 text-[#fd800a]"
                  key={`${word}-${index}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de progression décorative */}
        <div className="mt-8 h-1 w-52 overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-1/2 animate-loader-progress
            rounded-full bg-[#fd800a]" />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase
          tracking-[0.25em] text-gray-400">
          Construire. Impacter. Conquérir.
        </p>
      </div>
    </main>
  );
}
