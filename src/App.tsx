import React, { useState, useEffect } from "react";
import { 
  INITIAL_CLIENTS, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS, 
  STUDIO_STATS 
} from "./data/mockData";
import { 
  Client, 
  Booking, 
  Payment, 
  Coupon, 
  Review, 
  StudioStats, 
  BookingStatus, 
  PaymentStatus 
} from "./types";
import {
  seedInitialDataIfNeeded,
  getClientsFromFirestore,
  addClientToFirestore,
  updateClientInFirestore,
  getBookingsFromFirestore,
  addBookingToFirestore,
  updateBookingInFirestore,
  getPaymentsFromFirestore,
  addPaymentToFirestore,
  updatePaymentInFirestore,
  getCouponsFromFirestore,
  addCouponToFirestore,
  updateCouponInFirestore,
  deleteCouponFromFirestore,
  getReviewsFromFirestore,
  updateReviewInFirestore
} from "./lib/firebase";
import Login from "./components/Login";
import DashboardOverview from "./components/DashboardOverview";
import ClientsTab from "./components/ClientsTab";
import BookingsTab from "./components/BookingsTab";
import PaymentsTab from "./components/PaymentsTab";
import CouponsTab from "./components/CouponsTab";
import ReviewsTab from "./components/ReviewsTab";
import { 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Receipt, 
  Gift, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Session State
  const [adminUser, setAdminUser] = useState<string | null>(() => {
    return localStorage.getItem("aura_luxe_admin_email") || null;
  });

  // Database States
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  const [stats, setStats] = useState<StudioStats>(STUDIO_STATS);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Firestore database content asynchronously
  useEffect(() => {
    const initAndLoadDb = async () => {
      try {
        setDbLoading(true);
        // Step 1. Ensure the DB is seeded if it's completely empty
        await seedInitialDataIfNeeded();

        // Step 2. Pull all records from cloud Firestore
        const [loadedClients, loadedBookings, loadedPayments, loadedCoupons, loadedReviews] = await Promise.all([
          getClientsFromFirestore(),
          getBookingsFromFirestore(),
          getPaymentsFromFirestore(),
          getCouponsFromFirestore(),
          getReviewsFromFirestore()
        ]);

        setClients(loadedClients);
        setBookings(loadedBookings);
        setPayments(loadedPayments);
        setCoupons(loadedCoupons);
        setReviews(loadedReviews);
      } catch (err) {
        console.error("Critical error during Firestore initial load:", err);
      } finally {
        setDbLoading(false);
      }
    };

    if (adminUser) {
      initAndLoadDb();
    } else {
      setDbLoading(false);
    }
  }, [adminUser]);

  // Recalculate Statistics Dynamically based on current live ledger state
  useEffect(() => {
    const totalRev = payments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + p.amount, 0);

    const activeVIPs = clients.filter((c) => c.status === "Active").length;
    
    const calculatedReviews = reviews.filter(r => r.status === "Published");
    const avgRating = calculatedReviews.length > 0
      ? Number((calculatedReviews.reduce((sum, r) => sum + r.rating, 0) / calculatedReviews.length).toFixed(2))
      : 4.8;

    setStats({
      totalRevenue: totalRev,
      revenueChange: 14.5, // Constant premium indicators
      totalBookings: bookings.length,
      bookingsChange: 8.2,
      activeClients: activeVIPs,
      clientsChange: 11.3,
      averageRating: avgRating,
      ratingCount: reviews.length
    });
  }, [bookings, payments, clients, reviews]);

  const handleLogin = (email: string) => {
    setAdminUser(email);
    localStorage.setItem("aura_luxe_admin_email", email);
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem("aura_luxe_admin_email");
  };

  // CRUD Handlers
  const handleAddClient = (newClient: Client) => {
    setClients([newClient, ...clients]);
    addClientToFirestore(newClient).catch(err => console.error("Error adding client to Firestore:", err));
  };

  const handleUpdateClient = (updated: Client) => {
    setClients(clients.map(c => c.id === updated.id ? updated : c));
    updateClientInFirestore(updated).catch(err => console.error("Error updating client in Firestore:", err));
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    addBookingToFirestore(newBooking).catch(err => console.error("Error adding booking to Firestore:", err));

    // Automatically generate a companion payment record
    const companionPayment: Payment = {
      id: `P-${Math.floor(5000 + Math.random() * 900)}`,
      bookingId: newBooking.id,
      clientName: newBooking.clientName,
      serviceName: newBooking.serviceName,
      date: newBooking.date,
      amount: newBooking.price,
      method: "Card",
      status: newBooking.paymentStatus,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPayments([companionPayment, ...payments]);
    addPaymentToFirestore(companionPayment).catch(err => console.error("Error adding companion payment to Firestore:", err));

    // Update guest total spending and booking count if booking is completed/paid
    const updatedClients = clients.map(c => {
      if (c.email === newBooking.clientEmail) {
        const updatedCl = {
          ...c,
          bookingsCount: c.bookingsCount + 1,
          totalSpent: c.totalSpent + (newBooking.paymentStatus === PaymentStatus.PAID ? newBooking.price : 0)
        };
        updateClientInFirestore(updatedCl).catch(err => console.error("Error updating client bookings in Firestore:", err));
        return updatedCl;
      }
      return c;
    });
    setClients(updatedClients);
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings(bookings.map(b => b.id === updated.id ? updated : b));
    updateBookingInFirestore(updated).catch(err => console.error("Error updating booking in Firestore:", err));
    
    // Propagate payment status to companion payment record
    const updatedPayments = payments.map(p => {
      if (p.bookingId === updated.id) {
        const updatedPay = { ...p, status: updated.paymentStatus };
        updatePaymentInFirestore(updatedPay).catch(err => console.error("Error updating payment in Firestore:", err));
        return updatedPay;
      }
      return p;
    });
    setPayments(updatedPayments);

    // Re-adjust total spends for the client
    const prev = bookings.find(b => b.id === updated.id);
    if (prev && prev.paymentStatus !== updated.paymentStatus) {
      const updatedClients = clients.map(c => {
        if (c.email === updated.clientEmail) {
          const diff = updated.paymentStatus === PaymentStatus.PAID ? updated.price : -updated.price;
          const updatedCl = {
            ...c,
            totalSpent: Math.max(0, c.totalSpent + diff)
          };
          updateClientInFirestore(updatedCl).catch(err => console.error("Error updating client balance in Firestore:", err));
          return updatedCl;
        }
        return c;
      });
      setClients(updatedClients);
    }
  };

  const handleUpdatePayment = (updated: Payment) => {
    setPayments(payments.map(p => p.id === updated.id ? updated : p));
    updatePaymentInFirestore(updated).catch(err => console.error("Error updating payment in Firestore:", err));
    
    // Propagate back to the booking record
    const updatedBookings = bookings.map(b => {
      if (b.id === updated.bookingId) {
        const updatedBk = { ...b, paymentStatus: updated.status };
        updateBookingInFirestore(updatedBk).catch(err => console.error("Error propagating booking status in Firestore:", err));
        return updatedBk;
      }
      return b;
    });
    setBookings(updatedBookings);

    // Adjust client total spent
    const companionBooking = bookings.find(b => b.id === updated.bookingId);
    if (companionBooking) {
      const updatedClients = clients.map(c => {
        if (c.email === companionBooking.clientEmail) {
          const prevPayment = payments.find(p => p.id === updated.id);
          if (prevPayment && prevPayment.status !== updated.status) {
            let change = 0;
            if (updated.status === PaymentStatus.PAID) {
              change = updated.amount;
            } else if (prevPayment.status === PaymentStatus.PAID) {
              change = -updated.amount;
            }
            const updatedCl = {
              ...c,
              totalSpent: Math.max(0, c.totalSpent + change)
            };
            updateClientInFirestore(updatedCl).catch(err => console.error("Error updating client spent in Firestore:", err));
            return updatedCl;
          }
        }
        return c;
      });
      setClients(updatedClients);
    }
  };

  const handleRecordPayment = (newPay: Payment) => {
    setPayments([newPay, ...payments]);
    addPaymentToFirestore(newPay).catch(err => console.error("Error recording payment in Firestore:", err));
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons([newCoupon, ...coupons]);
    addCouponToFirestore(newCoupon).catch(err => console.error("Error adding coupon in Firestore:", err));
  };

  const handleUpdateCoupon = (updated: Coupon) => {
    setCoupons(coupons.map(c => c.id === updated.id ? updated : c));
    updateCouponInFirestore(updated).catch(err => console.error("Error updating coupon in Firestore:", err));
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    deleteCouponFromFirestore(id).catch(err => console.error("Error deleting coupon in Firestore:", err));
  };

  const handleUpdateReview = (updated: Review) => {
    setReviews(reviews.map(r => r.id === updated.id ? updated : r));
    updateReviewInFirestore(updated).catch(err => console.error("Error updating review in Firestore:", err));
  };

  // Render Session Login if unauthenticated
  if (!adminUser) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // Sidebar navigation configuration
  const MENU_ITEMS = [
    { id: "dashboard", label: "Analytics Desk", icon: LayoutDashboard },
    { id: "clients", label: "Luxury Clients", icon: Users },
    { id: "bookings", label: "Ritual Bookings", icon: CalendarDays },
    { id: "payments", label: "Payments Ledger", icon: Receipt },
    { id: "coupons", label: "Promo Campaigns", icon: Gift },
    { id: "reviews", label: "Client Journals", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] flex font-sans" id="app-viewport">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EAE8E4] h-screen sticky top-0" id="desktop-sidebar">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#EAE8E4] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-amber-200 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div>
            <h1 className="font-display text-base tracking-widest font-bold">AURA LUXE</h1>
            <span className="text-[10px] text-[#C5A880] font-mono tracking-widest block uppercase">Atelier Panel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none ${
                  isSelected 
                    ? "bg-[#1A1A1A] text-white shadow-sm" 
                    : "text-stone-500 hover:bg-[#FAF9F6] hover:text-stone-900"
                }`}
                id={`nav-item-${item.id}`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-amber-200" : "text-stone-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Time display & Logout */}
        <div className="p-4 border-t border-[#EAE8E4] space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF9F6] border border-[#EAE8E4] rounded-xl text-[10px] font-mono text-stone-500">
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center justify-between px-3 py-2">
            <div className="truncate pr-2">
              <span className="text-[10px] text-stone-400 block font-semibold uppercase">Authorized</span>
              <span className="text-[11px] font-mono font-bold text-stone-700 truncate block">{adminUser}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all"
              title="Logout Concierge Session"
              id="logout-button-desktop"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EAE8E4] flex items-center justify-between px-4 z-40" id="mobile-top-bar">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>
          <h1 className="font-display text-sm tracking-widest font-bold">AURA LUXE</h1>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border border-[#EAE8E4] rounded-xl text-stone-600 focus:outline-none"
          id="toggle-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-30 pt-16 flex flex-col lg:hidden"
            id="mobile-drawer-overlay"
          >
            <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      isSelected 
                        ? "bg-[#1A1A1A] text-white" 
                        : "text-stone-500 hover:bg-[#FAF9F6]"
                    }`}
                    id={`mobile-nav-item-${item.id}`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-amber-200" : "text-stone-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#EAE8E4] bg-[#FAF9F6]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold uppercase">Session Admin</span>
                  <span className="text-xs font-mono font-bold text-stone-700 block">{adminUser}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
                  id="logout-button-mobile"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIMARY WORKSPACE CONTENT STAGE */}
      <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8 overflow-x-hidden" id="workspace-content-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={dbLoading ? "loading" : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            id={`tab-wrapper-${dbLoading ? "loading" : activeTab}`}
          >
            {dbLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
                </div>
                <p className="text-xs font-mono text-[#C5A880] uppercase tracking-widest animate-pulse">Syncing with Atelier Ledger...</p>
              </div>
            ) : (
              <>
                {activeTab === "dashboard" && (
                  <DashboardOverview 
                    stats={stats} 
                    bookings={bookings} 
                    reviews={reviews} 
                    payments={payments}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === "clients" && (
                  <ClientsTab 
                    clients={clients} 
                    onAddClient={handleAddClient} 
                    onUpdateClient={handleUpdateClient} 
                  />
                )}

                {activeTab === "bookings" && (
                  <BookingsTab 
                    bookings={bookings} 
                    clients={clients} 
                    onAddBooking={handleAddBooking} 
                    onUpdateBooking={handleUpdateBooking} 
                  />
                )}

                {activeTab === "payments" && (
                  <PaymentsTab 
                    payments={payments} 
                    onUpdatePayment={handleUpdatePayment} 
                    onRecordPayment={handleRecordPayment} 
                  />
                )}

                {activeTab === "coupons" && (
                  <CouponsTab 
                    coupons={coupons} 
                    onAddCoupon={handleAddCoupon} 
                    onUpdateCoupon={handleUpdateCoupon} 
                    onDeleteCoupon={handleDeleteCoupon} 
                  />
                )}

                {activeTab === "reviews" && (
                  <ReviewsTab 
                    reviews={reviews} 
                    onUpdateReview={handleUpdateReview} 
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
