"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { auth } from "@/src/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userService } from "@/src/services/userService";

export default function PointsEarnedPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [newTotal, setNewTotal] = useState(0);
  const [oldTotal, setOldTotal] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [localKeyToUpdate, setLocalKeyToUpdate] = useState("");

  // Synthesize a beautiful rising game chime (C5 -> E5 -> G5)
  const playSuccessChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Note 1: C5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      // Note 2: E5 (100ms later)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 100);

      // Note 3: G5 (200ms later)
      setTimeout(() => {
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(783.99, ctx.currentTime);
        gain3.gain.setValueAtTime(0.1, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start();
        osc3.stop(ctx.currentTime + 0.35);
      }, 200);
    } catch (e) {
      console.warn("Audio context not allowed or supported yet.");
    }
  };

  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Listen to the user document in real-time
        const unsubscribeSnapshot = userService.subscribeToUser(currentUser.uid, (data) => {
          if (data) {
            const currentPoints = typeof (data as any).points === "number" ? (data as any).points : 0;
            const pointsLastSeen = typeof (data as any).pointsLastSeen === "number" ? (data as any).pointsLastSeen : null;
            
            if (pointsLastSeen !== null) {
              if (currentPoints > pointsLastSeen) {
                const diff = currentPoints - pointsLastSeen;
                setEarnedPoints(diff);
                setNewTotal(currentPoints);
                setOldTotal(pointsLastSeen);
                setShowPopup(true);
                
                // Trigger effects
                playSuccessChime();
                setTimeout(() => {
                  confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.4 }
                  });
                }, 300);
              } else if (currentPoints < pointsLastSeen) {
                // If points decreased, just update pointsLastSeen silently
                userService.updateUser(currentUser.uid, { pointsLastSeen: currentPoints }).catch(console.error);
              }
            } else {
              // Initial load of the user: set pointsLastSeen to their current points
              userService.updateUser(currentUser.uid, { pointsLastSeen: currentPoints }).catch(console.error);
            }
          }
        }, (error) => {
          console.error("Error listening to user points:", error);
        });

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setShowPopup(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Animate the points counter (0 to earnedPoints) when popup shows
  useEffect(() => {
    if (showPopup && earnedPoints > 0) {
      setDisplayPoints(0);
      let start = 0;
      const end = earnedPoints;
      const duration = 1200; // 1.2s
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out back-like feel or ease out quad
        const ease = progress * (2 - progress);
        const current = Math.floor(ease * end);
        
        setDisplayPoints(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayPoints(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [showPopup, earnedPoints]);

  const handleClose = async () => {
    const currentUser = auth?.currentUser;
    if (currentUser) {
      try {
        await userService.updateUser(currentUser.uid, {
          pointsLastSeen: newTotal
        });
      } catch (err) {
        console.error("Error updating pointsLastSeen in Firestore:", err);
      }
    }
    setShowPopup(false);
  };

  return (
    <>
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            
            {/* Glowing rotating sunburst (Duolingo Style) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-[700px] h-[700px] opacity-15"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(234,179,8,0.4) 20deg, transparent 40deg, rgba(234,179,8,0.4) 60deg, transparent 80deg, rgba(234,179,8,0.4) 100deg, transparent 120deg, rgba(234,179,8,0.4) 140deg, transparent 160deg, rgba(234,179,8,0.4) 180deg, transparent 200deg, rgba(234,179,8,0.4) 220deg, transparent 240deg, rgba(234,179,8,0.4) 260deg, transparent 280deg, rgba(234,179,8,0.4) 300deg, transparent 320deg, rgba(234,179,8,0.4) 340deg, transparent 360deg)"
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: 100 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.45 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[32px] border-4 border-amber-400 bg-[#1F2937] p-8 text-center shadow-[0_25px_60px_rgba(245,158,11,0.25)]"
            >
              {/* Duolingo style header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block text-[11px] font-black uppercase tracking-[3px] text-[#FFC800] bg-[#FFC800]/10 px-4 py-1.5 rounded-full mb-2">
                  ⚡ NOUVEAUX POINTS !
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Félicitations !
                </h2>
              </motion.div>

              {/* Bouncy 3D Points Gem */}
              <div className="relative my-8 flex flex-col items-center justify-center h-44">
                <div className="absolute w-36 h-36 rounded-full bg-[#FFC800]/10 blur-2xl animate-pulse" />
                
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 cursor-pointer"
                  onClick={() => {
                    playSuccessChime();
                    confetti({
                      particleCount: 20,
                      spread: 40,
                      origin: { y: 0.4 }
                    });
                  }}
                >
                  {/* Custom 3D-looking Gold/Amber Gem with Lightning Bolt */}
                  <svg className="w-32 h-32 drop-shadow-[0_12px_24px_rgba(245,158,11,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 12L82 28V62L50 88L18 62V28L50 12Z" fill="url(#gemFront)" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                    <path d="M50 18L76 30V58L50 80L24 58V30L50 18Z" fill="url(#gemInner)" opacity="0.9"/>
                    <path d="M50 12L18 28L50 44L82 28L50 12Z" fill="url(#gemTop)" opacity="0.3"/>
                    <path d="M53 28L37 51H48L43 72L61 45H49L53 28Z" fill="#FFFFFF" filter="url(#glow)"/>
                    <defs>
                      <linearGradient id="gemFront" x1="50" y1="12" x2="50" y2="88" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FBBF24"/>
                        <stop offset="100%" stopColor="#D97706"/>
                      </linearGradient>
                      <linearGradient id="gemInner" x1="50" y1="18" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F59E0B"/>
                        <stop offset="100%" stopColor="#92400E"/>
                      </linearGradient>
                      <linearGradient id="gemTop" x1="50" y1="12" x2="50" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFFFFF"/>
                        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0"/>
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                  </svg>
                </motion.div>

                {/* Animated "+XX PTS" Badge */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute bottom-1 bg-[#EAB308] border-b-4 border-[#A16207] text-white px-5 py-1 rounded-2xl font-black text-lg shadow-md uppercase tracking-wide"
                >
                  +{displayPoints} PTS
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 mb-8"
              >
                <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-[280px] mx-auto">
                  Votre présentation a été évaluée ! L'administration vous a attribué des points supplémentaires.
                </p>
                <div className="text-xs text-amber-400 font-bold">
                  Nouveau total : {newTotal} PTS (auparavant {oldTotal} PTS)
                </div>
              </motion.div>

              {/* Duolingo 3D Button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl bg-[#58CC02] border-b-[6px] border-[#46A302] hover:bg-[#61E002] active:border-b-0 active:translate-y-[6px] active:mb-[6px] text-white font-black text-sm tracking-wider uppercase shadow-md transition-all duration-100"
                >
                  GÉNIAL !
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
