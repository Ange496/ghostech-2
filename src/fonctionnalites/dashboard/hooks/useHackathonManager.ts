"use client";

import { useState, useEffect } from "react";

interface HackathonItem {
  id: number | string;
  title: string;
  status: "a-venir" | "termine";
  statusLabel: string;
  statusColor: string;
  date: string;
  prizePool: string;
  participants: number | string;
  theme: string;
  tags: string[];
  img: string;
  cardStyle: string;
  titleColor: string;
  textColor: string;
  lieu?: string;
}

const DEFAULT_HACKATHONS: HackathonItem[] = [
  {
    id: 2,
    title: "AI & Automation Hackathon",
    status: "a-venir" as const,
    statusLabel: "À Venir",
    statusColor: "bg-blue-500/10 text-blue-500 border-blue-200",
    date: "05 - 07 Septembre 2026",
    prizePool: "1 000 000 FCFA",
    participants: 120,
    theme: "Concevoir un agent conversationnel intelligent capable d'automatiser le support client.",
    tags: ["Python", "Watsonx", "LLM"],
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
    cardStyle: "bg-white border-slate-200 shadow-md",
    titleColor: "text-slate-900",
    textColor: "text-slate-600",
  },
];

export interface HackathonFormState {
  title: string;
  status: "a-venir" | "termine";
  date: string;
  prize: string;
  participants: string;
  theme: string;
  tags: string;
  image: string;
  lieu: string;
}

const EMPTY_HACK_FORM: HackathonFormState = {
  title: "",
  status: "a-venir",
  date: "",
  prize: "",
  participants: "120",
  theme: "",
  tags: "",
  image: "",
  lieu: "",
};

import { isFirebaseConfigured } from "@/src/lib/firebase/config";
import * as hackathonService from "@/src/lib/firebase/services/hackathons";

export function useHackathonManager() {
  const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [form, setForm] = useState<HackathonFormState>(EMPTY_HACK_FORM);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Firebase or localStorage
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = hackathonService.subscribeToHackathons((data) => {
        const formattedData = data.map<HackathonItem>(h => ({
          id: h.id,
          title: h.title,
          status: h.status === "termine" ? "termine" : "a-venir",
          statusLabel: h.status === "a-venir" ? "À Venir" : "Terminé",
          statusColor: h.status === "a-venir" ? "bg-blue-500/10 text-blue-500 border-blue-200" : "bg-slate-500/10 text-slate-500 border-slate-200",
          date: h.startDate,
          prizePool: h.totalPrize,
          participants: h.participantsCount,
          theme: h.theme,
          tags: h.tags || ["Tech"],
          lieu: h.location || "En ligne / Hybride",
          img: h.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
          cardStyle: "bg-white border-slate-200 shadow-md",
          titleColor: "text-slate-900",
          textColor: "text-slate-600",
        }));
        setHackathons(formattedData.length > 0 ? formattedData : DEFAULT_HACKATHONS);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      const stored = localStorage.getItem("local_hackathons");
      if (stored) {
        try {
          // Local storage can only be read after hydration in the browser.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setHackathons(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse hackathons", e);
        }
      } else {
        setHackathons(DEFAULT_HACKATHONS);
        localStorage.setItem("local_hackathons", JSON.stringify(DEFAULT_HACKATHONS));
      }
      setIsLoading(false);
    }
  }, []);

  const updateField = <K extends keyof HackathonFormState>(key: K, value: HackathonFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_HACK_FORM);
    setShowModal(true);
  };

  const openEdit = (hack: HackathonItem) => {
    setEditingId(hack.id);
    setForm({
      title: hack.title,
      status: hack.status,
      date: hack.date,
      prize: hack.prizePool,
      participants: (hack.participants || 120).toString(),
      theme: hack.theme,
      tags: hack.tags ? hack.tags.join(", ") : "",
      image: hack.img,
      lieu: hack.lieu || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setForm(EMPTY_HACK_FORM);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.theme) return;

    if (isFirebaseConfigured) {
      const fbData = {
        title: form.title,
        status: form.status,
        theme: form.theme,
        description: form.theme, // Currently no distinct description field in form
        startDate: form.date,
        endDate: form.date,
        participantsCount: form.participants,
        totalPrize: form.prize,
        image: form.image,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : ["Tech"],
        location: form.lieu || "En ligne / Hybride",
      };

      if (editingId !== null && typeof editingId === 'string') {
        await hackathonService.updateHackathon(editingId, fbData);
      } else {
        await hackathonService.addHackathon(fbData);
      }
    } else {
      let updated: HackathonItem[];
      if (editingId !== null) {
        updated = hackathons.map((h) =>
          h.id === editingId
            ? {
                ...h,
                title: form.title,
                status: form.status,
                statusLabel: form.status === "a-venir" ? "À Venir" : "Terminé",
                statusColor:
                  form.status === "a-venir"
                    ? "bg-blue-500/10 text-blue-500 border-blue-200"
                    : "bg-slate-500/10 text-slate-500 border-slate-200",
                date: form.date,
                prizePool: form.prize || "À définir",
                participants: parseInt(form.participants) || 0,
                theme: form.theme,
                tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : ["Tech"],
                img: form.image || h.img || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
                lieu: form.lieu || "En ligne / Hybride",
              }
            : h
        );
      } else {
        const newHack = {
          id: Date.now(),
          title: form.title,
          status: form.status,
          statusLabel: form.status === "a-venir" ? "À Venir" : "Terminé",
          statusColor:
            form.status === "a-venir"
              ? "bg-blue-500/10 text-blue-500 border-blue-200"
              : "bg-slate-500/10 text-slate-500 border-slate-200",
          date: form.date,
          prizePool: form.prize || "À définir",
          participants: parseInt(form.participants) || 0,
          theme: form.theme,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : ["Tech"],
          img: form.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
          cardStyle: "bg-white border-slate-200 shadow-md",
          titleColor: "text-slate-900",
          textColor: "text-slate-600",
          lieu: form.lieu || "En ligne / Hybride",
        };
        updated = [newHack, ...hackathons];
      }
      setHackathons(updated);
      localStorage.setItem("local_hackathons", JSON.stringify(updated));
    }
    
    closeModal();
  };

  const handleDelete = async (id: number | string) => {
    if (isFirebaseConfigured && typeof id === 'string') {
      await hackathonService.deleteHackathon(id);
    } else {
      const updated = hackathons.filter((h) => h.id !== id);
      setHackathons(updated);
      localStorage.setItem("local_hackathons", JSON.stringify(updated));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateField("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return {
    hackathons,
    showModal,
    editingId,
    form,
    updateField,
    openAdd,
    openEdit,
    closeModal,
    handleSubmit,
    handleDelete,
    handleImageUpload,
    isLoading,
  };
}
