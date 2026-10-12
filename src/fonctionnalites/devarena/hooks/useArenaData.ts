import { useState, useEffect } from "react";
import { auth } from "@/src/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isFirebaseConfigured } from "@/src/lib/firebase/config";
import * as arenaService from "@/src/lib/firebase/services/arenaService";
import { initializeArenaData, DEFAULT_PARTICIPANTS, DEFAULT_WAVES, DEFAULT_DUOS } from "@/src/fonctionnalites/devarena/donnees/arena-data";

export const LOCAL_DEFAULT_PARTICIPANTS = DEFAULT_PARTICIPANTS;
export const LOCAL_DEFAULT_WAVES = DEFAULT_WAVES;

export function useArenaData() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [waves, setWaves] = useState<any[]>([]);
  const [duos, setDuos] = useState<any[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setCurrentUserEmail(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubParticipants = arenaService.subscribeToParticipants((data) => {
        setParticipants(data);
      });
      const unsubWaves = arenaService.subscribeToWaves((data) => {
        setWaves(data.length > 0 ? data : LOCAL_DEFAULT_WAVES);
      });
      const unsubDuos = arenaService.subscribeToDuos((data) => {
        setDuos(data);
      });

      return () => {
        unsubParticipants();
        unsubWaves();
        unsubDuos();
      };
    } else {
      initializeArenaData();
      const loadData = () => {
        const storedParticipants = localStorage.getItem("arena_participants");
        const storedWaves = localStorage.getItem("arena_waves");
        const storedDuos = localStorage.getItem("arena_duos");

        setParticipants(storedParticipants ? JSON.parse(storedParticipants) : []);
        setWaves(storedWaves ? JSON.parse(storedWaves) : LOCAL_DEFAULT_WAVES);
        setDuos(storedDuos ? JSON.parse(storedDuos) : []);
      };

      loadData();

      const handleSync = () => {
        loadData();
      };

      window.addEventListener("storage", handleSync);
      window.addEventListener("arena_sync", handleSync);

      return () => {
        window.removeEventListener("storage", handleSync);
        window.removeEventListener("arena_sync", handleSync);
      };
    }
  }, []);

  // Find currentUser details dynamically
  const currentUser = participants.find(p => 
    (currentUserEmail && p.email === currentUserEmail) || 
    p.name === "Utilisateur" || 
    p.id === "p4"
  ) || null;

  // Sort participants by points descending
  const sortedParticipants = [...participants].sort((a, b) => (b.points || 0) - (a.points || 0));
  const top3 = sortedParticipants.slice(0, 3);
  
  // Fill top3 if missing
  const top1 = top3[0] || null;
  const top2 = top3[1] || null;
  const top3User = top3[2] || null;

  const userRankIndex = currentUser ? sortedParticipants.findIndex(p => p.id === currentUser.id) : -1;
  const userRankDisplay = userRankIndex !== -1 ? `${userRankIndex + 1}e` : "Non classé";

  const upcomingDuos = duos
    .filter(d => d.status === "upcoming" || d.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    participants,
    waves,
    duos,
    currentUser,
    sortedParticipants,
    top1,
    top2,
    top3: top3User,
    userRankDisplay,
    upcomingDuos,
  };
}
