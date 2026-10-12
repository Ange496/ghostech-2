"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, X } from "lucide-react";
import { useMembers } from "@/src/fonctionnalites/membres/hooks/useMembers";
import MemberRow from "@/src/fonctionnalites/membres/composants/MemberRow";
import { UserProfile } from "@/src/types/user.types";

export default function MembresPage() {
  const { members, loading, errorMsg, updateMember } = useMembers();
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{userId: string, field: string, value: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const membersPerPage = 10;
  const resetPage = () => setCurrentPage(1);

  const handleUpdateMember = async (userId: string, field: string, value: string) => {
    const result = await updateMember(userId, field, value);
    if (result.success) {
      setToast({ 
        message: `${field === 'role' ? 'Le rôle' : 'Le statut'} a été mis à jour avec succès.`, 
        type: "success" 
      });
    } else {
      setToast({ 
        message: result.error instanceof Error
          ? result.error.message
          : "Erreur lors de la mise à jour des permissions.", 
        type: "error" 
      });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (member: UserProfile) => {
    if (!member.id) {
      setToast({ message: "Impossible de modifier ce membre sans identifiant.", type: "error" });
      return;
    }

    const currentStatus = member.status || "Actif";
    setConfirmDialog({
      userId: member.id,
      field: "status",
      value: currentStatus === "Actif" ? "En pause" : "Actif",
    });
  };

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !normalizedQuery ||
        (member.name || "").toLowerCase().includes(normalizedQuery) ||
        (member.email || "").toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "Tous" || (member.role || "utilisateur") === roleFilter;
      const matchesStatus = statusFilter === "Tous" || (member.status || "Actif") === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, roleFilter, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage));
  const displayPage = Math.min(currentPage, totalPages);
  const firstMemberIndex = (displayPage - 1) * membersPerPage;
  const visibleMembers = filteredMembers.slice(firstMemberIndex, firstMemberIndex + membersPerPage);

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium text-sm flex items-center gap-3 ${
              toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="member-details-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedMember.photoURL ||
                      selectedMember.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name || "User")}&background=E2E8F0&color=0F172A`
                    }
                    alt={selectedMember.name || "Utilisateur"}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <h2 id="member-details-title" className="text-xl font-bold text-slate-900">
                      {selectedMember.name || "Utilisateur anonyme"}
                    </h2>
                    <p className="text-sm text-slate-500">{selectedMember.email || "Email non renseigné"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Fermer les détails"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rôle</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.role || "utilisateur"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Statut</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.status || "Actif"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Niveau</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.level || "Non renseigné"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Points</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.points ?? selectedMember.xp ?? 0}</p>
                </div>
              </div>

              {selectedMember.bio && (
                <div className="mt-4 rounded-xl border border-slate-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Présentation</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{selectedMember.bio}</p>
                </div>
              )}

              {selectedMember.stats && (
                <div className="mt-4 rounded-xl border border-slate-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Activité DevArena</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <span>Vagues terminées : <strong>{selectedMember.stats.wavesCompleted}</strong></span>
                    <span>Projets envoyés : <strong>{selectedMember.stats.projectsSubmitted}</strong></span>
                    <span>Votes reçus : <strong>{selectedMember.stats.totalVotesReceived}</strong></span>
                    <span>Victoires : <strong>{selectedMember.stats.firstPlaceWins}</strong></span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1b1c1a] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">Confirmer la modification</h3>
              <p className="text-stone-400 text-sm mb-6">
              Êtes-vous sûr de vouloir définir le {confirmDialog.field === 'role' ? 'rôle' : 'statut'} sur <span className="text-slate-900 font-bold">{confirmDialog.value}</span> ?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-400 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    handleUpdateMember(confirmDialog.userId, confirmDialog.field, confirmDialog.value);
                    setConfirmDialog(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 transition-all"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Membres</h1>
          <p className="text-stone-500 text-sm mt-1">Consultez et gérez les membres de la plateforme Ghostech.</p>
        </div>
      </div>

      <div className="bg-[#1b1c1a] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 bg-white/[0.04] px-4 py-2 rounded-xl border border-white/10 focus-within:border-[#fd800a]/50 w-full sm:w-72">
            <Search size={16} className="text-stone-500" />
            <input 
              type="text" 
              placeholder="Rechercher un membre..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                resetPage();
              }}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-stone-600"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen((open) => !open)}
            aria-expanded={isFilterOpen}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors ${
              isFilterOpen || roleFilter !== "Tous" || statusFilter !== "Tous"
                ? "border-teal-200 bg-teal-50 text-teal-700"
                : "border-white/10 bg-white/[0.04] text-stone-400 hover:bg-white/[0.08]"
            }`}
          >
            <Filter size={16} />
            Filtrer
          </button>
        </div>
        {isFilterOpen && (
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500">
              Rôle
              <select
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value);
                  resetPage();
                }}
                className="rounded-lg border border-white/10 bg-[#252623] px-3 py-2 text-sm font-normal text-stone-200 outline-none focus:border-[#fd800a]"
              >
                <option value="Tous">Tous les rôles</option>
                <option value="utilisateur">Utilisateur</option>
                <option value="membre">Membre</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500">
              Statut
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  resetPage();
                }}
                className="rounded-lg border border-white/10 bg-[#252623] px-3 py-2 text-sm font-normal text-stone-200 outline-none focus:border-[#fd800a]"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="En pause">En pause</option>
                <option value="Inactif">Inactif</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setRoleFilter("Tous");
                setStatusFilter("Tous");
                setSearchQuery("");
                resetPage();
              }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-800"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="responsive-table">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="text-xs text-stone-500 uppercase bg-white/[0.03] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Membre</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Date d&apos;inscription</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                    Chargement des membres...
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-rose-600">
                    <div className="font-bold mb-2">Erreur</div>
                    {errorMsg}
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Aucun membre trouvé.
                  </td>
                </tr>
              ) : visibleMembers.map((member, i) => (
                <MemberRow 
                  key={member.id} 
                  member={member} 
                  index={i}
                  onView={setSelectedMember}
                  onToggleStatus={handleToggleStatus}
                  onUpdateSelect={(userId, field, value) => setConfirmDialog({ userId, field, value })}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-500">
          <span>
            {filteredMembers.length === 0
              ? "Aucun membre à afficher"
              : `Affichage de ${firstMemberIndex + 1} à ${Math.min(firstMemberIndex + membersPerPage, filteredMembers.length)} sur ${filteredMembers.length} membres`}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled=              {displayPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 font-bold text-teal-600">
              {displayPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={displayPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
