import { doc, getDoc, setDoc, updateDoc, collection, getDocs, arrayUnion, onSnapshot } from "firebase/firestore";
import { requireFirebaseDb } from "./firebase";
import { UserProfile } from "../types/user.types";

export const userService = {
  // Get a single user by ID
  async getUser(userId: string): Promise<UserProfile | null> {
    const db = requireFirebaseDb();
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  },

  // Create or merge a user profile
  async createUser(userId: string, data: Partial<UserProfile>, options: { merge?: boolean } = {}): Promise<Partial<UserProfile>> {
    const db = requireFirebaseDb();
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, options);
    return data;
  },

  // Update a user profile
  async updateUser(userId: string, data: Partial<UserProfile>): Promise<Partial<UserProfile>> {
    const db = requireFirebaseDb();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
    return data;
  },

  // Get all users
  async getAllUsers(): Promise<UserProfile[]> {
    const db = requireFirebaseDb();
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as UserProfile);
    });
    return users;
  },

  // Subscribe to all users in real-time
  subscribeToUsers(callback: (users: UserProfile[]) => void, onError?: (error: Error) => void) {
    const db = requireFirebaseDb();
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProfile));
      callback(users);
    }, onError);
  },

  // Subscribe to a single user in real-time
  subscribeToUser(userId: string, callback: (user: UserProfile | null) => void, onError?: (error: Error) => void) {
    const db = requireFirebaseDb();
    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      } else {
        callback(null);
      }
    }, onError);
  },
  
  // Award a badge to a user
  async awardBadge(userId: string, badgeId: string) {
    const db = requireFirebaseDb();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      badges: arrayUnion(badgeId)
    });
  }
};
