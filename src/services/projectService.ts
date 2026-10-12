import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { requireFirebaseDb } from "./firebase";
import { ProjectData } from "../types/project.types";

export const projectService = {
  // Get all projects for a user
  async getUserProjects(userId: string): Promise<ProjectData[]> {
    const db = requireFirebaseDb();
    // Currently the codebase doesn't filter by userId in the root, it just grabs everything?
    // Let's implement it generic
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const projects: ProjectData[] = [];
    querySnapshot.forEach((doc) => {
      // client side filtering might be used, but let's just return all for now
      projects.push({ id: doc.id, ...doc.data() } as ProjectData);
    });
    return projects;
  },

  // Subscribe to all projects in real-time
  subscribeToProjects(callback: (projects: ProjectData[]) => void, onError?: (error: Error) => void) {
    const db = requireFirebaseDb();
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProjectData));
      callback(projects);
    }, onError);
  },

  // Get a single project
  async getProject(projectId: string): Promise<ProjectData | null> {
    const db = requireFirebaseDb();
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectData;
    }
    return null;
  },

  // Create a new project
  async createProject(data: ProjectData): Promise<string> {
    const db = requireFirebaseDb();
    const docRef = await addDoc(collection(db, "projects"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update a project
  async updateProject(projectId: string, data: Partial<ProjectData>): Promise<void> {
    const db = requireFirebaseDb();
    const docRef = doc(db, "projects", projectId);
    await updateDoc(docRef, data);
  },

  // Delete a project
  async deleteProject(projectId: string) {
    const db = requireFirebaseDb();
    const docRef = doc(db, "projects", projectId);
    await deleteDoc(docRef);
  }
};
