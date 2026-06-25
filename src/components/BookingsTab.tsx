import React, { useState } from "react";
import { Booking, BookingStatus, PaymentStatus, Client } from "../types";
import { Plus, Check, Ban, ClipboardList, Calendar, MapPin, User, DollarSign, X, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { motion } from "motion/react";

interface BookingsTabProps {
  bookings: Booking[];
  clients: Client[];
  onAddBooking: (booking: Booking) => void;
  onUpdateBooking: (booking: Booking) => void;
}

const LUXURY_SERVICES = [
  { name: "Signature HydraFacial & Gold Lift", price: 280, duration: "75 mins" },
  { name: "24K Gold Dust Massage & Stone Ritual", price: 320, duration: "90 mins" },
  { name: "Couture Balayage & Olaplex Treatment", price: 450, duration: "180 mins" },
  { name: "Aura Royal Pedicure & Mani Couture", price: 180, duration: "60 mins" },
  { name: "Advanced Lash Sculpting & Brow Couture", price: 220, duration: "90 mins" }
];

const THERAPISTS = ["Elena Rostova", "Marc Antoine", "Yuki Tanaka", "Serena Williams"];

export default function BookingsTab({ bookings, clients, onAddBooking, onUpdateBooking }: BookingsTabProps) {
  const [filterStatus, setFilterStatus] = useState<"All" | BookingStatus>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [selectedClientEmail, setSelectedClientEmail] = useState("");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [selectedTherapist, setSelectedTherapist] = useState(THERAPISTS[0]);

  const filteredBookings = bookings.filter((b) => {
    return filterStatus === "All" || b.status === filterStatus;
  });

  const handleOpenAdd = () => {
    if (clients.length > 0) {
      setSelectedClientEmail(clients[0].email);
    }
    setBookingDate(new Date().toISOString().split("T")[0]);
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.email === selectedClientEmail);
    if (!client) return;

    const service = LUXURY_SERVICES[selectedServiceIndex];

    const newBooking: Booking = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: client.name,
      clientEmail: client.email,
      serviceName: service.name,
      date: bookingDate,
      time: bookingTime,
      therapist: selectedTherapist,
      price: service.price,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    onAddBooking(newBooking);
    setShowAddModal(false);
  };

  const updateStatus = (booking: Booking, newStatus: BookingStatus) => {
    const updated: Booking = {
      ...booking,
      status: newStatus,
      // If completed, maybe auto paid? Or separate. Let's keep separate or update paid
      paymentStatus: newStatus === BookingStatus.COMPLETED ? PaymentStatus.PAID : booking.paymentStatus
    };
    onUpdateBooking(updated);
  };

  const updatePaymentStatus = (booking: Booking, newPayment: PaymentStatus) => {
    const updated: Booking = {
      ...booking,
      paymentStatus: newPayment
    };
    onUpdateBooking(updated);
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
    <div className="space-y-6" id="bookings-tab-container">
      {/* Filtering and Actions Panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-5 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] gap-4">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5" id="bookings-filter-bar">
          <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status</span>
          </span>
          {(["All", BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.CANCELLED] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status 
                  ? "bg-[#1A1A1A] text-white shadow-sm" 
                  : "bg-[#FAF9F6] border border-[#EAE8E4] text-stone-500 hover:text-stone-800"
              }`}
              id={`bookings-filter-${status.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm"
          id="book-appointment-button"
        >
          <Plus className="w-4 h-4" />
          <span>Book Ritual</span>
        </button>
      </div>

      {/* Bookings Table / Grid List */}
      <div className="bg-white rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="bookings-table">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EAE8E4]">
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Booking Code</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Client / Guest</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Service Ritual</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Schedule Time</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Stylist / Atelier</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Price</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Payment</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E4]">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-mono font-bold text-stone-800 bg-[#FAF9F6] border border-[#EAE8E4] px-2 py-1 rounded-lg">
                        {b.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">{b.clientName}</span>
                        <span className="text-[10px] text-stone-400 font-mono block">{b.clientEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span className="text-xs text-stone-700 font-medium">{b.serviceName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-stone-700 block">{b.date}</span>
                        <span className="text-[10px] text-stone-400 font-mono block">{b.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-stone-600 font-medium">{b.therapist}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-mono font-bold text-stone-800">
                        {formatCurrency(b.price)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={b.paymentStatus}
                        onChange={(e) => updatePaymentStatus(b, e.target.value as PaymentStatus)}
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-lg focus:outline-none border border-transparent ${
                          b.paymentStatus === PaymentStatus.PAID
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : b.paymentStatus === PaymentStatus.PENDING
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-stone-100 text-stone-500 border-stone-200"
                        }`}
                        id={`payment-status-${b.id}`}
                      >
                        <option value={PaymentStatus.PAID}>{PaymentStatus.PAID}</option>
                        <option value={PaymentStatus.PENDING}>{PaymentStatus.PENDING}</option>
                        <option value={PaymentStatus.REFUNDED}>{PaymentStatus.REFUNDED}</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        b.status === BookingStatus.CONFIRMED
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : b.status === BookingStatus.COMPLETED
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : b.status === BookingStatus.PENDING
                          ? "bg-stone-50 text-stone-600 border-stone-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {b.status === BookingStatus.PENDING && (
                          <button
                            onClick={() => updateStatus(b, BookingStatus.CONFIRMED)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg transition-colors"
                            title="Confirm booking"
                            id={`confirm-booking-${b.id}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status === BookingStatus.CONFIRMED && (
                          <button
                            onClick={() => updateStatus(b, BookingStatus.COMPLETED)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition-colors"
                            title="Complete booking"
                            id={`complete-booking-${b.id}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.COMPLETED && (
                          <button
                            onClick={() => updateStatus(b, BookingStatus.CANCELLED)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors"
                            title="Cancel appointment"
                            id={`cancel-booking-${b.id}`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ClipboardList className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500 font-medium">No beauty rituals booked under this category.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#EAE8E4] w-full max-w-md rounded-2xl p-6 shadow-xl relative"
            id="book-appointment-modal"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl text-stone-800 tracking-wide mb-1 font-normal">Schedule Salon Ritual</h3>
            <p className="text-stone-400 text-xs mb-6">Instantly create a confirmed booking for an existing client.</p>

            {clients.length === 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 text-center flex flex-col items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>You must create at least one client profile in the Users list before scheduling a booking.</span>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-4" id="book-ritual-form">
                {/* Select Client */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Select Guest Profile</label>
                  <select
                    required
                    value={selectedClientEmail}
                    onChange={(e) => setSelectedClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="booking-client-select"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.email}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                {/* Select Service */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Beauty & Spa Ritual</label>
                  <select
                    value={selectedServiceIndex}
                    onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="booking-service-select"
                  >
                    {LUXURY_SERVICES.map((s, idx) => (
                      <option key={idx} value={idx}>{s.name} — {formatCurrency(s.price)} ({s.duration})</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Ritual Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                      id="booking-date-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Preferred Hour</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                      id="booking-time-select"
                    >
                      {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Therapist */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Atelier Artist / Therapist</label>
                  <select
                    value={selectedTherapist}
                    onChange={(e) => setSelectedTherapist(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880]"
                    id="booking-therapist-select"
                  >
                    {THERAPISTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Price Display */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-600">Calculated Premium Price</span>
                  <span className="font-mono font-bold text-[#C5A880] text-sm">
                    {formatCurrency(LUXURY_SERVICES[selectedServiceIndex].price)}
                  </span>
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
                    className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Confirm & Schedule</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
