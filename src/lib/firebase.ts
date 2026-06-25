import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";
import { Client, Booking, Payment, Coupon, Review } from "../types";
import { 
  INITIAL_CLIENTS, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS 
} from "../data/mockData";

// User-supplied Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD51tGPZCaHPOAA_dnj_DIQHPAzsZniTlI",
  authDomain: "beauty-ae724.firebaseapp.com",
  databaseURL: "https://beauty-ae724-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beauty-ae724",
  storageBucket: "beauty-ae724.firebasestorage.app",
  messagingSenderId: "432217513680",
  appId: "1:432217513680:web:40396a5dd01b0aa35d88d5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Operational Error Handling as requested by Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Automatic Seeding Logic
export async function seedInitialDataIfNeeded() {
  try {
    const clientsRef = collection(db, "clients");
    const snapshot = await getDocs(clientsRef);
    if (snapshot.empty) {
      console.log("Firestore database is empty. Performing luxury data seeding...");
      
      const batch = writeBatch(db);

      // Seed Clients
      INITIAL_CLIENTS.forEach((client) => {
        const docRef = doc(db, "clients", client.id);
        batch.set(docRef, client);
      });

      // Seed Bookings
      INITIAL_BOOKINGS.forEach((booking) => {
        const docRef = doc(db, "bookings", booking.id);
        batch.set(docRef, booking);
      });

      // Seed Payments
      INITIAL_PAYMENTS.forEach((payment) => {
        const docRef = doc(db, "payments", payment.id);
        batch.set(docRef, payment);
      });

      // Seed Coupons
      INITIAL_COUPONS.forEach((coupon) => {
        const docRef = doc(db, "coupons", coupon.id);
        batch.set(docRef, coupon);
      });

      // Seed Reviews
      INITIAL_REVIEWS.forEach((review) => {
        const docRef = doc(db, "reviews", review.id);
        batch.set(docRef, review);
      });

      await batch.commit();
      console.log("Luxury data seeding completed successfully.");
    }
  } catch (error) {
    console.error("Failed to seed initial data:", error);
    // Silent fail in case permissions are not fully open, but log it
  }
}

// --- Collection APIs with Mandatory Error Handling wrappers ---

// Clients
export async function getClientsFromFirestore(): Promise<Client[]> {
  const path = "clients";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Client[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Client);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addClientToFirestore(client: Client): Promise<void> {
  const path = `clients/${client.id}`;
  try {
    await setDoc(doc(db, "clients", client.id), client);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateClientInFirestore(client: Client): Promise<void> {
  const path = `clients/${client.id}`;
  try {
    await setDoc(doc(db, "clients", client.id), client);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Bookings
export async function getBookingsFromFirestore(): Promise<Booking[]> {
  const path = "bookings";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Booking[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Booking);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addBookingToFirestore(booking: Booking): Promise<void> {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, "bookings", booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBookingInFirestore(booking: Booking): Promise<void> {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, "bookings", booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Payments
export async function getPaymentsFromFirestore(): Promise<Payment[]> {
  const path = "payments";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Payment[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Payment);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addPaymentToFirestore(payment: Payment): Promise<void> {
  const path = `payments/${payment.id}`;
  try {
    await setDoc(doc(db, "payments", payment.id), payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePaymentInFirestore(payment: Payment): Promise<void> {
  const path = `payments/${payment.id}`;
  try {
    await setDoc(doc(db, "payments", payment.id), payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Coupons
export async function getCouponsFromFirestore(): Promise<Coupon[]> {
  const path = "coupons";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Coupon[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Coupon);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addCouponToFirestore(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, "coupons", coupon.id), coupon);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCouponInFirestore(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, "coupons", coupon.id), coupon);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCouponFromFirestore(id: string): Promise<void> {
  const path = `coupons/${id}`;
  try {
    await deleteDoc(doc(db, "coupons", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Reviews
export async function getReviewsFromFirestore(): Promise<Review[]> {
  const path = "reviews";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const list: Review[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Review);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateReviewInFirestore(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, "reviews", review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
