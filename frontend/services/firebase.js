import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Load config from env variables; provide safe placeholders for CI builds.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'PLACEHOLDER_API_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '0000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:0000000000:web:placeholder',
};

let app;
if (typeof window !== 'undefined') {
  // Client‑side only – avoid duplicate init.
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}
export const auth = typeof window !== 'undefined' ? getAuth(app) : null;
