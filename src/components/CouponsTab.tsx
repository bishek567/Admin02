import React, { useState } from "react";
import { Coupon } from "../types";
import { Plus, ToggleLeft, ToggleRight, Gift, Calendar, Percent, DollarSign, X, Sparkles, Check, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface CouponsTabProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onUpdateCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
}

export default function CouponsTab({ coupons, onAddCoupon, onUpdateCoupon, onDeleteCoupon }: CouponsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 15,
    maxUses: 100,
    expiryDate: "",
    status: "Active" as "Active" | "Expired"
  });

  const handleGenerateCode = () => {
    const prefixes = ["AURA", "LUXE", "ATELIER", "GLOW", "VIP"];
    const randPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randNum = Math.floor(10 + Math.random() * 90); // 2 digit random
    const randomCode = `${randPrefix}${formData.discountValue}${randNum}`;
    setFormData({ ...formData, code: randomCode.toUpperCase() });
  };

  const handleOpenAdd = () => {
    // Default expiry is 3 months from now
    const futDate = new Date();
    futDate.setMonth(futDate.getMonth() + 3);
    const expiryStr = futDate.toISOString().split("T")[0];

    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 15,
      maxUses: 100,
      expiryDate: expiryStr,
      status: "Active"
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const newCoupon: Coupon = {
      id: `CP-${Math.floor(10 + Math.random() * 90)}`,
      code: formData.code.toUpperCase().replace(/\s+/g, ""),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      maxUses: formData.maxUses,
      usedCount: 0,
      expiryDate: formData.expiryDate,
      status: formData.status
    };

    onAddCoupon(newCoupon);
    setShowAddModal(false);
  };

  const toggleStatus = (coupon: Coupon) => {
    const updated: Coupon = {
      ...coupon,
      status: coupon.status === "Active" ? "Expired" : "Active"
    };
    onUpdateCoupon(updated);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="coupons-tab-container">
      {/* Title & Add Button Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] gap-4">
        <div>
          <h2 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide">Promotions Ledger</h2>
          <p className="text-stone-400 text-xs">Manage boutique campaign coupons and special client offers.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm"
          id="new-coupon-button"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="coupons-grid">
        {coupons.map((coupon) => {
          const isExpired = coupon.status === "Expired";
          const percentUsed = Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100));

          return (
            <motion.div
              whileHover={{ y: -2 }}
              key={coupon.id}
              className={`bg-white rounded-2xl border border-[#EAE8E4] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden ${
                isExpired ? "opacity-75" : ""
              }`}
            >
              {/* Top Banner Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FAF9F6]" />

              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#C5A880]">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-400 font-mono block">{coupon.id}</span>
                      <span className="text-xs text-stone-500 font-medium block">
                        {coupon.discountType === "percentage" ? "Percentage Off" : "Fixed Discount"}
                      </span>
                    </div>
                  </div>

                  {/* Toggle switch active state */}
                  <button
                    onClick={() => toggleStatus(coupon)}
                    className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                    title="Toggle active status"
                    id={`toggle-coupon-${coupon.id}`}
                  >
                    {coupon.status === "Active" ? (
                      <ToggleRight className="w-8 h-8 text-[#C5A880]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-stone-300" />
                    )}
                  </button>
                </div>

                {/* Promo Code Display (Interactive copy) */}
                <div className="bg-[#FAF9F6] border border-[#EAE8E4] p-3 rounded-xl flex justify-between items-center">
                  <span className="font-mono text-sm font-extrabold text-stone-800 tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="text-[10px] font-bold tracking-wider text-[#C5A880] uppercase hover:underline"
                    id={`copy-code-${coupon.id}`}
                  >
                    {copiedCode === coupon.code ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      "Copy Code"
                    )}
                  </button>
                </div>

                {/* Discount value details */}
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-stone-800">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </span>
                  <span className="text-[#C5A880] text-xs font-mono uppercase tracking-wider">Discount Value</span>
                </div>

                {/* Redemption progression */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-stone-500">
                    <span>Redeemed {coupon.usedCount} times</span>
                    <span>Max {coupon.maxUses} uses</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#FAF9F6] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        percentUsed >= 90 ? "bg-amber-600" : "bg-[#C5A880]"
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="border-t border-[#EAE8E4] pt-3.5 mt-4 flex justify-between items-center text-xs">
                <span className="text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-300" />
                  Expires: {coupon.expiryDate}
                </span>

                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    coupon.status === "Active" 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-red-50 text-red-600"
                  }`}>
                    {coupon.status}
                  </span>
                  
                  {/* Delete Coupon */}
                  <button
                    onClick={() => onDeleteCoupon(coupon.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                    title="Remove coupon"
                    id={`delete-coupon-${coupon.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#EAE8E4] w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-in"
            id="add-coupon-modal"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl text-stone-800 tracking-wide mb-1 font-normal">Generate Atelier Coupon</h3>
            <p className="text-stone-400 text-xs mb-6">Create campaign discounts for exclusive salon lists.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4" id="generate-coupon-form">
              {/* Discount Value and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="coupon-add-type"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Sum ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formData.discountType === "percentage" ? 100 : 1000}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="coupon-add-value"
                  />
                </div>
              </div>

              {/* Code input with Random Generator */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Promotional Code</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[10px] text-[#C5A880] font-bold tracking-wider uppercase hover:underline inline-flex items-center gap-0.5"
                    id="coupon-generate-code-button"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMERGLOW15"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs font-mono font-bold tracking-wider text-stone-800 focus:outline-none focus:border-[#C5A880]"
                  id="coupon-add-code"
                />
              </div>

              {/* Expiry Date & Usage Count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Expiry Calendar</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="coupon-add-expiry"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Maximum Redemptions</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="coupon-add-maxuses"
                  />
                </div>
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
                  Post Campaign
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
