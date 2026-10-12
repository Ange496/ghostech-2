import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config";

const COLLECTION_NAME = "hackathons";

const getHackathonsCollection = () => {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  return collection(db, COLLECTION_NAME);
};

export interface HackathonData {
  id: string;
  title: string;
  status: string; // 'draft', 'published', 'completed'
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  participantsCount: string;
  totalPrize: string;
  image?: string; // Cloudinary URL
  tags?: string[];
  location?: string;
  createdAt?: string;
}

export const getHackathons = async (): Promise<HackathonData[]> => {
  const q = query(getHackathonsCollection(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HackathonData));
};

export const subscribeToHackathons = (callback: (hackathons: HackathonData[]) => void) => {
  const q = query(getHackathonsCollection(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const hackathons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HackathonData));
    callback(hackathons);
  });
};

export const addHackathon = async (data: Omit<HackathonData, "id" | "createdAt">) => {
  return await addDoc(getHackathonsCollection(), {
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const updateHackathon = async (id: string, data: Partial<HackathonData>) => {
  const docRef = doc(getHackathonsCollection(), id);
  return await updateDoc(docRef, data);
};

export const deleteHackathon = async (id: string) => {
  const docRef = doc(getHackathonsCollection(), id);
  return await deleteDoc(docRef);
};
