export enum BookingStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export enum PaymentStatus {
  PAID = "Paid",
  PENDING = "Pending",
  REFUNDED = "Refunded"
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  totalSpent: number;
  status: "Active" | "Suspended";
  joinedDate: string;
  notes?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  therapist: string;
  price: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  clientName: string;
  serviceName: string;
  date: string;
  amount: number;
  method: "Card" | "Apple Pay" | "Cash" | "Bank Transfer";
  status: PaymentStatus;
  invoiceNumber: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: "Active" | "Expired";
}

export interface Review {
  id: string;
  clientName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Published" | "Hidden";
  reply?: string;
  replyDate?: string;
}

export interface StudioStats {
  totalRevenue: number;
  revenueChange: number; // percentage
  totalBookings: number;
  bookingsChange: number; // percentage
  activeClients: number;
  clientsChange: number; // percentage
  averageRating: number;
  ratingCount: number;
}
