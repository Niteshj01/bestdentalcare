import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import appletConfig from "../../firebase-applet-config.json";

// Retrieve configuration from environment variables or use the user's custom project defaults as fallback
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || appletConfig.apiKey || "AIzaSyALTUtC8gleluHMNDpDCGiT4-QSwVR1TG0",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || "dr-sky-dentistry.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || "dr-sky-dentistry",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || "dr-sky-dentistry.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || "974895700116",
  appId: metaEnv.VITE_FIREBASE_APP_ID || appletConfig.appId || "1:974895700116:web:ab16f851646fc72287bc81",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId || "G-NC1HXQGFXZ"
};

const databaseId = metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId || "(default)";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services with robust configuration for environments with iframe/proxy restrictions
export const auth = getAuth(app);

// Use initializeFirestore with experimentalForceLongPolling to ensure connection reliability
const firestoreSettings = {
  experimentalForceLongPolling: true
};

export const db = databaseId && databaseId !== "(default)"
  ? initializeFirestore(app, firestoreSettings, databaseId)
  : initializeFirestore(app, firestoreSettings);

export const storage = getStorage(app);

export default app;
