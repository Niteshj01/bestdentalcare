import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Retrieve configuration from environment variables or use the user's custom project defaults as fallback
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyALTUtC8gleluHMNDpDCGiT4-QSwVR1TG0",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "dr-sky-dentistry.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "dr-sky-dentistry",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "dr-sky-dentistry.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "974895700116",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:974895700116:web:ab16f851646fc72287bc81",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-NC1HXQGFXZ"
};

const databaseId = metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 
  (firebaseConfig.projectId === "singular-math-3qmt3" ? "ai-studio-d60d8e40-da5a-4c08-8363-140e7af57dda" : "(default)");

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = databaseId && databaseId !== "(default)" ? getFirestore(app, databaseId) : getFirestore(app);
export const storage = getStorage(app);

export default app;
