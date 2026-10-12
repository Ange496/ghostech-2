"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { auth } from "@/src/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userService } from "@/src/services/userService";

import { GameBadge, gameEngine } from "@/src/services/gameEngine";

export default function BadgeUnlockPopup() {
  const [user, setUser] = useState<any>(null);
  const [activeBadge, setActiveBadge] = useState<GameBadge | null>(null);
  const [queue, setQueue] = useState<GameBadge[]>([]);

  useEffect(() => {
    const unsubscribe = auth ? onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkNewBadges(currentUser.uid);
      }
    }) : undefined;

    // Listen for arena sync events
    const handleSync = () => {
      if (auth?.currentUser) {
        checkNewBadges(auth.currentUser.uid);
      }
    };

    window.addEventListener("arena_sync", handleSync);

    return () => {
      unsubscribe?.();
      window.removeEventListener("arena_sync", handleSync);
    };
  }, []);

  const checkNewBadges = async (uid: string) => {
    try {
      // 1. Get user profile from Firestore to get their real stats
      const userData = await userService.getUser(uid);
      if (!userData) return;

      // 2. Evaluate which badges they should have based on true game logic
      const newlyUnlocked = gameEngine.evaluateNewBadges(userData);

      // 3. Filter out those they have already seen locally in this session (before Firestore has synced)
      const validNewBadges = newlyUnlocked.filter(badge => {
        const localSeenKey = `badge_seen_${badge.id}_${uid}`;
        return localStorage.getItem(localSeenKey) !== "true";
      });

      if (validNewBadges.length > 0) {
        setQueue(validNewBadges);
      }
    } catch (err) {
      console.error("Error checking badges:", err);
    }
  };

  // Trigger when queue changes
  useEffect(() => {
    if (queue.length > 0 && !activeBadge) {
      const nextBadge = queue[0];
      setActiveBadge(nextBadge);
      setQueue(prev => prev.slice(1));

      // Trigger massive confetti celebration!
      setTimeout(() => {
        // Center burst
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 }
        });
        // Left side
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 }
        });
        // Right side
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 }
        });
      }, 500);
    }
  }, [queue, activeBadge]);

  const handleClose = async () => {
    if (!activeBadge || !user) return;

    const badge = activeBadge;
    setActiveBadge(null);

    try {
      // 1. Mark as seen locally to avoid rapid re-triggering
      localStorage.setItem(`badge_seen_${badge.id}_${user.uid}`, "true");

      // 2. Save badge to Firestore
      await userService.awardBadge(user.uid, badge.id);

      // 3. Add XP Bonus (e.g. 50 XP per badge)
      const userData = await userService.getUser(user.uid);
      if (userData) {
        await gameEngine.addXP(user.uid, userData, 50);
      }

      // 4. Dispatch sync event so Profile UI knows to refresh
      window.dispatchEvent(new Event("badge_unlocked_sync"));
    } catch (err) {
      console.error("Error saving unlocked badge:", err);
    }
  };

  return (
    <AnimatePresence>
      {activeBadge && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          
          {/* Rotating Sunburst / Light Rays (Duolingo Style) */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-[800px] h-[800px] opacity-20"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, rgba(245,158,11,0.4) 15deg, transparent 30deg, rgba(245,158,11,0.4) 45deg, transparent 60deg, rgba(245,158,11,0.4) 75deg, transparent 90deg, rgba(245,158,11,0.4) 105deg, transparent 120deg, rgba(245,158,11,0.4) 135deg, transparent 150deg, rgba(245,158,11,0.4) 165deg, transparent 180deg, rgba(245,158,11,0.4) 195deg, transparent 210deg, rgba(245,158,11,0.4) 225deg, transparent 240deg, rgba(245,158,11,0.4) 255deg, transparent 270deg, rgba(245,158,11,0.4) 285deg, transparent 300deg, rgba(245,158,11,0.4) 315deg, transparent 330deg, rgba(245,158,11,0.4) 345deg, transparent 360deg)"
              }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: "spring", duration: 1.1, bounce: 0.55 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border-4 border-slate-800 bg-[#1F2937] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Duolingo style header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-block text-[13px] font-black uppercase tracking-[3px] text-[#FFC800] bg-[#FFC800]/10 px-4 py-1.5 rounded-full mb-3">
                🏆 NOUVELLE MÉDAILLE !
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Débloquée !
              </h2>
            </motion.div>

            {/* Bouncy / Floating Medal Container */}
            <div className="relative my-10 flex justify-center items-center h-48">
              {/* Soft glow behind medal */}
              <div className="absolute w-40 h-40 rounded-full bg-[#FFC800]/15 blur-3xl animate-pulse" />
              
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  scale: [1, 1.04, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.4 }
                  });
                }}
              >
                <img 
                  src={activeBadge.icon} 
                  alt={activeBadge.title} 
                  className="w-40 h-40 object-contain drop-shadow-[0_15px_25px_rgba(255,200,0,0.25)]"
                />
              </motion.div>
            </div>

            {/* Medal Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 mb-8"
            >
              <h3 className="text-2xl font-black text-[#FFC800] tracking-tight">
                {activeBadge.title}
              </h3>
              <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-xs mx-auto">
                {activeBadge.description}
              </p>
            </motion.div>

            {/* Duolingo 3D Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="px-4"
            >
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-2xl bg-[#58CC02] border-b-[6px] border-[#46A302] hover:bg-[#61E002] active:border-b-0 active:translate-y-[6px] active:mb-[6px] text-white font-black text-sm tracking-wider uppercase shadow-md transition-all duration-100"
              >
                CONTINUER
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
