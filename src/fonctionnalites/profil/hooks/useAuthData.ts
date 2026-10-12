import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/services/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { UserProfile } from "../profil.types";
import { userService } from "@/src/services/userService";



export function useAuthData() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userData = await userService.getUser(currentUser.uid);
        if (userData) {
          setProfile(userData as UserProfile);
        } else {
          console.log("No such document!");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    const handleBadgeSync = async () => {
      if (firebaseAuth.currentUser) {
        const userData = await userService.getUser(firebaseAuth.currentUser.uid);
        if (userData) {
          setProfile(userData as UserProfile);
        }
      }
    };
    window.addEventListener("badge_unlocked_sync", handleBadgeSync);

    return () => {
      unsubscribe();
      window.removeEventListener("badge_unlocked_sync", handleBadgeSync);
    };
  }, [router]);

  const handleSignOut = async () => {
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      router.push("/");
      return;
    }

    try {
      await signOut(firebaseAuth);
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return {
    user,
    profile,
    setProfile,
    loading,
    handleSignOut
  };
}
