import { Client, Booking, BookingStatus, PaymentStatus, Payment, Coupon, Review, StudioStats } from "../types";

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "C-001",
    name: "Genevieve Dubois",
    email: "genevieve.dubois@luxe.com",
    phone: "+1 (555) 234-5678",
    bookingsCount: 8,
    totalSpent: 1650,
    status: "Active",
    joinedDate: "2025-10-14",
    notes: "Prefers Lavender essential oil. Always requests VIP room."
  },
  {
    id: "C-002",
    name: "Isabella Montgomery",
    email: "isabella.m@aurora.com",
    phone: "+1 (555) 876-5432",
    bookingsCount: 12,
    totalSpent: 2890,
    status: "Active",
    joinedDate: "2025-05-20",
    notes: "Allergic to eucalyptus. Prefers extra firm pressure in massage."
  },
  {
    id: "C-003",
    name: "Victoria Sterling",
    email: "v.sterling@prestige.co",
    phone: "+1 (555) 345-6789",
    bookingsCount: 5,
    totalSpent: 1200,
    status: "Active",
    joinedDate: "2026-01-08",
    notes: "Signature Balayage client. Requests cappuccino with oat milk."
  },
  {
    id: "C-004",
    name: "Sophia Laurent",
    email: "sophia.laurent@vogue.fr",
    phone: "+1 (555) 456-7890",
    bookingsCount: 3,
    totalSpent: 750,
    status: "Active",
    joinedDate: "2026-03-02",
    notes: "Prefers Charlotte Tilbury cosmetics for makeup sessions."
  },
  {
    id: "C-005",
    name: "Anastasia Romanov",
    email: "anastasia.r@czar.com",
    phone: "+1 (555) 901-2345",
    bookingsCount: 1,
    totalSpent: 350,
    status: "Active",
    joinedDate: "2026-06-15",
    notes: "Interested in high-end microblading consultation."
  },
  {
    id: "C-006",
    name: "Penelope Vance",
    email: "p.vance@charleston.net",
    phone: "+1 (555) 678-1234",
    bookingsCount: 0,
    totalSpent: 0,
    status: "Suspended",
    joinedDate: "2026-06-20",
    notes: "Account suspended due to multiple last-minute no-shows."
  },
  {
    id: "C-007",
    name: "Charlotte Beaumont",
    email: "c.beaumont@chateau.com",
    phone: "+1 (555) 789-2345",
    bookingsCount: 6,
    totalSpent: 1450,
    status: "Active",
    joinedDate: "2025-11-05",
    notes: "Enjoys express skin detox and warm tea service."
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "B-1001",
    clientName: "Genevieve Dubois",
    clientEmail: "genevieve.dubois@luxe.com",
    serviceName: "Signature HydraFacial & Gold Lift",
    date: "2026-06-25",
    time: "10:00 AM",
    therapist: "Elena Rostova",
    price: 280,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: "2026-06-20T14:30:00Z"
  },
  {
    id: "B-1002",
    clientName: "Victoria Sterling",
    clientEmail: "v.sterling@prestige.co",
    serviceName: "Couture Balayage & Olaplex Treatment",
    date: "2026-06-25",
    time: "01:30 PM",
    therapist: "Marc Antoine",
    price: 450,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: "2026-06-21T09:15:00Z"
  },
  {
    id: "B-1003",
    clientName: "Isabella Montgomery",
    clientEmail: "isabella.m@aurora.com",
    serviceName: "24K Gold Dust Massage & Stone Ritual",
    date: "2026-06-26",
    time: "11:00 AM",
    therapist: "Yuki Tanaka",
    price: 320,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: "2026-06-24T16:45:00Z"
  },
  {
    id: "B-1004",
    clientName: "Sophia Laurent",
    clientEmail: "sophia.laurent@vogue.fr",
    serviceName: "Aura Royal Pedicure & Mani Couture",
    date: "2026-06-24",
    time: "03:00 PM",
    therapist: "Serena Williams",
    price: 180,
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: "2026-06-18T11:20:00Z"
  },
  {
    id: "B-1005",
    clientName: "Charlotte Beaumont",
    clientEmail: "c.beaumont@chateau.com",
    serviceName: "Advanced Lash Sculpting & Brow Couture",
    date: "2026-06-27",
    time: "09:30 AM",
    therapist: "Elena Rostova",
    price: 220,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: "2026-06-22T08:05:00Z"
  },
  {
    id: "B-1006",
    clientName: "Anastasia Romanov",
    clientEmail: "anastasia.r@czar.com",
    phone: "+1 (555) 901-2345",
    serviceName: "Signature HydraFacial & Gold Lift",
    date: "2026-06-28",
    time: "04:00 PM",
    therapist: "Elena Rostova",
    price: 280,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: "2026-06-24T18:10:00Z"
  } as any
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "P-5001",
    bookingId: "B-1001",
    clientName: "Genevieve Dubois",
    serviceName: "Signature HydraFacial & Gold Lift",
    date: "2026-06-25",
    amount: 280,
    method: "Card",
    status: PaymentStatus.PAID,
    invoiceNumber: "INV-2026-1042"
  },
  {
    id: "P-5002",
    bookingId: "B-1002",
    clientName: "Victoria Sterling",
    serviceName: "Couture Balayage & Olaplex Treatment",
    date: "2026-06-25",
    amount: 450,
    method: "Card",
    status: PaymentStatus.PENDING,
    invoiceNumber: "INV-2026-1043"
  },
  {
    id: "P-5003",
    bookingId: "B-1004",
    clientName: "Sophia Laurent",
    serviceName: "Aura Royal Pedicure & Mani Couture",
    date: "2026-06-24",
    amount: 180,
    method: "Apple Pay",
    status: PaymentStatus.PAID,
    invoiceNumber: "INV-2026-1041"
  },
  {
    id: "P-5004",
    bookingId: "B-1005",
    clientName: "Charlotte Beaumont",
    serviceName: "Advanced Lash Sculpting & Brow Couture",
    date: "2026-06-22",
    amount: 220,
    method: "Apple Pay",
    status: PaymentStatus.PAID,
    invoiceNumber: "INV-2026-1039"
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "CP-01",
    code: "AURALUXE15",
    discountType: "percentage",
    discountValue: 15,
    maxUses: 100,
    usedCount: 42,
    expiryDate: "2026-12-31",
    status: "Active"
  },
  {
    id: "CP-02",
    code: "GOLDENGLOW50",
    discountType: "fixed",
    discountValue: 50,
    maxUses: 50,
    usedCount: 18,
    expiryDate: "2026-08-31",
    status: "Active"
  },
  {
    id: "CP-03",
    code: "WELCOMEVIP",
    discountType: "percentage",
    discountValue: 20,
    maxUses: 200,
    usedCount: 185,
    expiryDate: "2026-06-30",
    status: "Active"
  },
  {
    id: "CP-04",
    code: "SPRINGRETREAT",
    discountType: "percentage",
    discountValue: 10,
    maxUses: 80,
    usedCount: 80,
    expiryDate: "2026-05-31",
    status: "Expired"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "R-901",
    clientName: "Isabella Montgomery",
    serviceName: "24K Gold Dust Massage & Stone Ritual",
    rating: 5,
    comment: "The Gold Dust Massage is absolute heaven on earth! Yuki has magical hands. The warm stones melted away every ounce of my stress. Aura Luxe is unmatched in its elegance.",
    date: "2026-06-22",
    status: "Published",
    reply: "Dear Isabella, thank you so much for your kind words. We are delighted to hear you enjoyed the 24K Gold Ritual. We look forward to welcoming you back to your sanctuary of wellness.",
    replyDate: "2026-06-23"
  },
  {
    id: "R-902",
    clientName: "Genevieve Dubois",
    serviceName: "Signature HydraFacial & Gold Lift",
    rating: 5,
    comment: "My skin has never glowed like this before. Elena's knowledge and custom facial routine is spectacular. Perfect ambiance, pure comfort.",
    date: "2026-06-20",
    status: "Published"
  },
  {
    id: "R-903",
    clientName: "Sophia Laurent",
    serviceName: "Aura Royal Pedicure & Mani Couture",
    rating: 4,
    comment: "Gorgeous nail artistry! Only giving 4 stars because the receptionist was running 10 minutes late, but the complimentary champagne and spectacular nails made up for it completely.",
    date: "2026-06-19",
    status: "Published"
  },
  {
    id: "R-904",
    clientName: "Elena Vlasov",
    serviceName: "Advanced Lash Sculpting",
    rating: 2,
    comment: "The lash extensions look beautiful but one side started falling off on day three. Hoping to get them adjusted soon.",
    date: "2026-06-15",
    status: "Hidden"
  }
];

export const STUDIO_STATS: StudioStats = {
  totalRevenue: 24890,
  revenueChange: 14.5,
  totalBookings: 182,
  bookingsChange: 8.2,
  activeClients: 76,
  clientsChange: 11.3,
  averageRating: 4.85,
  ratingCount: 54
};

export const REVENUE_TREND_DATA = [
  { month: "Jan", revenue: 15400, bookings: 112 },
  { month: "Feb", revenue: 17200, bookings: 124 },
  { month: "Mar", revenue: 19800, bookings: 138 },
  { month: "Apr", revenue: 18900, bookings: 130 },
  { month: "May", revenue: 22100, bookings: 162 },
  { month: "Jun", revenue: 24890, bookings: 182 }
];

export const SERVICE_POPULARITY = [
  { name: "Signature HydraFacial & Gold Lift", count: 68, revenue: 19040, color: "bg-amber-400" },
  { name: "24K Gold Dust Massage & Stone Ritual", count: 48, revenue: 15360, color: "bg-yellow-600" },
  { name: "Couture Balayage & Olaplex", count: 32, revenue: 14400, color: "bg-stone-500" },
  { name: "Aura Royal Pedicure & Mani Couture", count: 24, revenue: 4320, color: "bg-neutral-400" },
  { name: "Advanced Lash Sculpting & Brow Couture", count: 10, revenue: 2200, color: "bg-amber-300" }
];
