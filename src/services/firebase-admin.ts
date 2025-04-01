import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK once
const apps = getApps();

if (!apps.length) {
  const privateKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || "",
      privateKey,
    }),
  });
}

// Export admin services
export const adminAuth = getAuth();
export const adminDb = getFirestore();
