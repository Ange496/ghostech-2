import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config";

const COLLECTION_NAME = "formations";

const getFormationsCollection = () => {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  return collection(db, COLLECTION_NAME);
};

export interface FormationData {
  id?: string;
  title: string;
  status: string; // 'draft', 'published'
  category: string;
  description: string;
  instructor: string;
  duration: string;
  modules: string | number;
  level: string; // 'Débutant', 'Intermédiaire', 'Avancé'
  image?: string; // Cloudinary URL
  createdAt?: string;
}

export const getFormations = async (): Promise<FormationData[]> => {
  const q = query(getFormationsCollection(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormationData));
};

export const subscribeToFormations = (callback: (formations: FormationData[]) => void) => {
  const q = query(getFormationsCollection(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const formations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormationData));
    callback(formations);
  });
};

export const addFormation = async (data: Omit<FormationData, "id" | "createdAt">) => {
  return await addDoc(getFormationsCollection(), {
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const updateFormation = async (id: string, data: Partial<FormationData>) => {
  const docRef = doc(getFormationsCollection(), id);
  return await updateDoc(docRef, data);
};

export const deleteFormation = async (id: string) => {
  const docRef = doc(getFormationsCollection(), id);
  return await deleteDoc(docRef);
};
