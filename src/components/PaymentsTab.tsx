import React, { useState } from "react";
import { Payment, PaymentStatus } from "../types";
import { FileSpreadsheet, Receipt, CheckCircle, RefreshCcw, Landmark, Eye, X, Download, Printer, Filter, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface PaymentsTabProps {
  payments: Payment[];
  onUpdatePayment: (payment: Payment) => void;
  onRecordPayment: (payment: Payment) => void;
}

export default function PaymentsTab({ payments, onUpdatePayment, onRecordPayment }: PaymentsTabProps) {
  const [filterStatus, setFilterStatus] = useState<"All" | PaymentStatus>("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [showManualPayModal, setShowManualPayModal] = useState(false);

  // Form state for recording custom payment
  const [newPayData, setNewPayData] = useState({
    clientName: "",
    serviceName: "",
    amount: 150,
    method: "Card" as "Card" | "Apple Pay" | "Cash" | "Bank Transfer",
  });

  const filteredPayments = payments.filter((p) => {
    return filterStatus === "All" || p.status === filterStatus;
  });

  const handleUpdateStatus = (payment: Payment, newStatus: PaymentStatus) => {
    const updated: Payment = {
      ...payment,
      status: newStatus
    };
    onUpdatePayment(updated);
    if (selectedReceipt?.id === payment.id) {
      setSelectedReceipt(updated);
    }
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockPayment: Payment = {
      id: `P-${Math.floor(5000 + Math.random() * 900)}`,
      bookingId: `B-${Math.floor(1000 + Math.random() * 900)}`,
      clientName: newPayData.clientName,
      serviceName: newPayData.serviceName,
      date: new Date().toISOString().split("T")[0],
      amount: newPayData.amount,
      method: newPayData.method,
      status: PaymentStatus.PAID,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    onRecordPayment(mockPayment);
    setShowManualPayModal(false);
    // Reset
    setNewPayData({ clientName: "", serviceName: "", amount: 150, method: "Card" });
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
    <div className="space-y-6" id="payments-tab-container">
      {/* Filtering Actions Panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-5 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] gap-4">
        <div className="flex flex-wrap items-center gap-1.5" id="payments-filter-bar">
          <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Payments</span>
          </span>
          {(["All", PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.REFUNDED] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status 
                  ? "bg-[#1A1A1A] text-white shadow-sm" 
                  : "bg-[#FAF9F6] border border-[#EAE8E4] text-stone-500 hover:text-stone-800"
              }`}
              id={`payments-filter-${status.toLowerCase()}`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowManualPayModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm"
          id="record-payment-button"
        >
          <Landmark className="w-4 h-4 text-amber-200" />
          <span>Record Receipt</span>
        </button>
      </div>

      {/* Payments Table Ledger */}
      <div className="bg-white rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="payments-table">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EAE8E4]">
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Invoice / Code</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Guest Client</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Bespoke Ritual</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Date Created</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Payment Method</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Invoice Sum</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E4]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-mono font-bold text-[#1A1A1A]">
                        {p.invoiceNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-stone-800 block">
                        {p.clientName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-stone-600 font-medium">
                        {p.serviceName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-stone-500 font-mono">
                        {p.date}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-stone-600 bg-stone-50 border border-stone-200/50 px-2.5 py-1 rounded-lg">
                        {p.method}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-mono font-bold text-stone-800">
                        {formatCurrency(p.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        p.status === PaymentStatus.PAID
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : p.status === PaymentStatus.PENDING
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-stone-50 text-stone-500 border-stone-200"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="p-1.5 hover:bg-[#FAF9F6] text-[#C5A880] rounded-lg transition-colors"
                          title="View Digital Receipt"
                          id={`view-receipt-${p.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {p.status === PaymentStatus.PENDING && (
                          <button
                            onClick={() => handleUpdateStatus(p, PaymentStatus.PAID)}
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                            title="Mark as Settled/Paid"
                            id={`settle-payment-${p.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {p.status === PaymentStatus.PAID && (
                          <button
                            onClick={() => handleUpdateStatus(p, PaymentStatus.REFUNDED)}
                            className="p-1.5 hover:bg-stone-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                            title="Issue Refund"
                            id={`refund-payment-${p.id}`}
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileSpreadsheet className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500 font-medium">No recorded transactions found matching this state.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Record Modal */}
      {showManualPayModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#EAE8E4] w-full max-w-md rounded-2xl p-6 shadow-xl relative animate-in"
            id="record-manual-receipt-modal"
          >
            <button 
              onClick={() => setShowManualPayModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl text-stone-800 tracking-wide mb-1 font-normal">Record Ledger Receipt</h3>
            <p className="text-stone-400 text-xs mb-6">File custom transactions completed at the concierge desk.</p>

            <form onSubmit={handleRecordSubmit} className="space-y-4" id="record-ledger-receipt-form">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Client / Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Genevieve Dubois"
                  value={newPayData.clientName}
                  onChange={(e) => setNewPayData({ ...newPayData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="pay-client-name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Bespoke Ritual / Product</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Couture Perfume Session"
                  value={newPayData.serviceName}
                  onChange={(e) => setNewPayData({ ...newPayData, serviceName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                  id="pay-service-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Transaction Sum ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPayData.amount}
                    onChange={(e) => setNewPayData({ ...newPayData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="pay-amount-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Payment Method</label>
                  <select
                    value={newPayData.method}
                    onChange={(e) => setNewPayData({ ...newPayData, method: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="pay-method-select"
                  >
                    <option value="Card">Card</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualPayModal(false)}
                  className="px-4 py-2 border border-[#EAE8E4] rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Digital Receipt Modal (Luxury view) */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-[#EAE8E4] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
            id="digital-receipt-modal"
          >
            {/* Top decorative design */}
            <div className="bg-[#1A1A1A] text-white p-6 text-center space-y-1 relative">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-800 text-amber-200 mb-2">
                <Receipt className="w-4 h-4 text-[#C5A880]" />
              </div>
              <h4 className="font-display text-lg tracking-wider font-normal">AURA LUXE ATELIER</h4>
              <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">Certified Customer Invoice</p>
            </div>

            {/* Receipt Content */}
            <div className="p-6 space-y-6 bg-[#FCFBF9]">
              {/* Client and Invoice Details */}
              <div className="flex justify-between items-start text-xs border-b border-[#EAE8E4] pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Billed To</span>
                  <span className="text-stone-800 font-bold block">{selectedReceipt.clientName}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Receipt ID</span>
                  <span className="text-stone-800 font-mono font-bold block">{selectedReceipt.invoiceNumber}</span>
                  <span className="text-[10px] text-stone-400 font-mono block">{selectedReceipt.date}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Selected Service</span>
                <div className="flex justify-between text-xs py-1">
                  <div className="space-y-0.5">
                    <span className="text-stone-800 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      {selectedReceipt.serviceName}
                    </span>
                    <span className="text-stone-400 text-[10px] block">Premium Studio Ritual (1x)</span>
                  </div>
                  <span className="font-mono text-stone-800 font-semibold">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-[#EAE8E4] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Exclusive Salon VAT (0.0%)</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Concierge Surcharge</span>
                  <span className="font-mono text-emerald-600">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A] font-bold text-sm pt-2 border-t border-dashed border-[#EAE8E4]">
                  <span>Total Due</span>
                  <span className="font-mono text-amber-600">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="p-3 bg-white border border-[#EAE8E4] rounded-2xl flex items-center justify-between text-xs">
                <span className="text-stone-500">Transaction Status:</span>
                <span className={`font-bold tracking-wider uppercase px-2 py-0.5 rounded-lg text-[10px] ${
                  selectedReceipt.status === PaymentStatus.PAID
                    ? "bg-emerald-50 text-emerald-700"
                    : selectedReceipt.status === PaymentStatus.PENDING
                    ? "bg-amber-50 text-amber-700"
                    : "bg-stone-50 text-stone-400"
                }`}>
                  {selectedReceipt.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#EAE8E4]">
                {selectedReceipt.status === PaymentStatus.PENDING && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReceipt, PaymentStatus.PAID)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-colors"
                  >
                    Post Payment
                  </button>
                )}
                {selectedReceipt.status === PaymentStatus.PAID && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReceipt, PaymentStatus.REFUNDED)}
                    className="flex-1 border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 py-2 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-colors"
                  >
                    Refund Receipt
                  </button>
                )}
                <button
                  onClick={() => alert("Mocking PDF Download: Aura_Luxe_Invoice_" + selectedReceipt.invoiceNumber + ".pdf printed successfully.")}
                  className="p-2 border border-[#EAE8E4] hover:bg-[#FAF9F6] text-stone-500 hover:text-[#C5A880] rounded-xl transition-all"
                  title="Download PDF Ledger"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert("Concierge Direct Printing: Connected to Aura Wireless Receipt Printer.")}
                  className="p-2 border border-[#EAE8E4] hover:bg-[#FAF9F6] text-stone-500 hover:text-[#C5A880] rounded-xl transition-all"
                  title="Print Ledger Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom styling */}
            <div className="bg-[#FAF9F6] text-center p-4 border-t border-[#EAE8E4]">
              <p className="text-[10px] text-stone-400 italic">Thank you for curating luxury with Aura Luxe.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
