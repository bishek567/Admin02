import React, { useState } from "react";
import { Client } from "../types";
import { Search, Plus, UserCheck, ShieldAlert, Mail, Phone, CalendarDays, Edit3, X, User } from "lucide-react";
import { motion } from "motion/react";

interface ClientsTabProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
}

export default function ClientsTab({ clients, onAddClient, onUpdateClient }: ClientsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Suspended">("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    status: "Active" as "Active" | "Suspended"
  });
  
  // Edit State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({ name: "", email: "", phone: "", notes: "", status: "Active" });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: `C-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bookingsCount: 0,
      totalSpent: 0,
      status: formData.status,
      joinedDate: new Date().toISOString().split("T")[0],
      notes: formData.notes
    };
    onAddClient(newClient);
    setShowAddModal(false);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      notes: client.notes || "",
      status: client.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const updated: Client = {
      ...selectedClient,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      status: formData.status
    };
    onUpdateClient(updated);
    setShowEditModal(false);
  };

  const toggleStatus = (client: Client) => {
    const updated: Client = {
      ...client,
      status: client.status === "Active" ? "Suspended" : "Active"
    };
    onUpdateClient(updated);
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6" id="clients-tab-container">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-5 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] gap-4">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search VIP clients by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
            id="client-search-input"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Segment Filter */}
          <div className="flex bg-[#FAF9F6] p-1 rounded-xl border border-[#EAE8E4]">
            {(["All", "Active", "Suspended"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === status 
                    ? "bg-[#1A1A1A] text-white shadow-sm" 
                    : "text-stone-500 hover:text-stone-800"
                }`}
                id={`filter-clients-status-${status.toLowerCase()}`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm"
            id="add-client-button"
          >
            <Plus className="w-4 h-4" />
            <span>New Profile</span>
          </button>
        </div>
      </div>

      {/* Clients Table Card */}
      <div className="bg-white rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="clients-table">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EAE8E4]">
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Client Profile</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Contact Info</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Membership Date</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Visits</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Total Spent</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E4]">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#EAE8E4] flex items-center justify-center text-[#C5A880] font-display text-sm font-semibold">
                          {client.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-stone-800 block">{client.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono block">{client.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-xs text-stone-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {client.email}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {client.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-stone-600 flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
                        {client.joinedDate}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-50 border border-[#EAE8E4] text-xs font-mono font-bold text-stone-700">
                        {client.bookingsCount}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-mono font-bold text-stone-800">
                        {formatCurrency(client.totalSpent)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(client)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          client.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                        title="Click to toggle client status"
                        id={`toggle-client-${client.id}`}
                      >
                        {client.status === "Active" ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="p-2 hover:bg-[#FAF9F6] text-stone-500 hover:text-[#C5A880] rounded-xl transition-all"
                        title="Edit profile information"
                        id={`edit-client-${client.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <User className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500 font-medium">No luxury clients found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#EAE8E4] w-full max-w-md rounded-2xl p-6 shadow-xl relative"
            id="add-client-modal"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl text-stone-800 tracking-wide mb-1">Add Premium Client</h3>
            <p className="text-stone-400 text-xs mb-6">Create a new guest record in the Aura Luxe ledger.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4" id="add-client-form">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-add-name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="eleanor@vance.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-add-email"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-add-phone"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Studio Notes & Habits</label>
                <textarea
                  placeholder="Enter preferences, allergies, or tailored services guidelines..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880] resize-none"
                  id="client-add-notes"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#EAE8E4] rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#EAE8E4] w-full max-w-md rounded-2xl p-6 shadow-xl relative"
            id="edit-client-modal"
          >
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl text-stone-800 tracking-wide mb-1">Edit Client Profile</h3>
            <p className="text-stone-400 text-xs mb-6">Modify guest contact specifics or notes.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4" id="edit-client-form">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-edit-name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-edit-email"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-edit-phone"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Studio Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880] resize-none"
                  id="client-edit-notes"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="client-edit-status"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-[#EAE8E4] rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
