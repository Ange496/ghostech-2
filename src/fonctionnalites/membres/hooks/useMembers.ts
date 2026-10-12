import { useState, useEffect } from "react";
import { userService } from "@/src/services/userService";
import { UserProfile } from "@/src/types/user.types";
import { isFirebaseConfigured } from "@/src/lib/firebase/config";

export function useMembers() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    isFirebaseConfigured
      ? null
      : "Firebase n'est pas configuré. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local puis redémarrez le serveur pour charger et gérer les membres."
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersData = await userService.getAllUsers();
        setMembers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Erreur de connexion à la base de données."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateMember = async (userId: string, field: string, value: string) => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: new Error("Configurez Firebase pour modifier les membres."),
      };
    }

    try {
      await userService.updateUser(userId, {
        [field]: value
      });
      setMembers(members.map(m => m.id === userId ? { ...m, [field]: value } : m));
      return { success: true };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${field}:`, error);
      return { success: false, error };
    }
  };

  return { members, loading, errorMsg, updateMember };
}
