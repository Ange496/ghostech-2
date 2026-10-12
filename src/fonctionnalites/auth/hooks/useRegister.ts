import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/src/services/firebase";
import { userService } from "@/src/services/userService";

export function useRegister() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!auth) {
      setError("L'authentification Firebase n'est pas configurée.");
      return;
    }

    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await userService.createUser(userCredential.user.uid, {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        role: "utilisateur",
        points: 0,
        level: "Beginner",
        createdAt: new Date()
      });

      router.push('/');
    } catch (err: any) {
      console.error("FIREBASE ERROR:", err);
      const errorMessage = err.message || "Erreur inconnue";
      setError(`Erreur d'inscription : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("L'authentification Firebase n'est pas configurée.");
      return;
    }

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      await userService.createUser(result.user.uid, {
        uid: result.user.uid,
        name: result.user.displayName || "Utilisateur",
        email: result.user.email || "",
        role: "utilisateur",
        points: 0,
        level: "Beginner",
        createdAt: new Date()
      }, { merge: true });

      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleRegister,
    handleGoogleSignIn
  };
}
