// lib/firebase.ts — clean Firebase init, no Storage, no Analytics
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY             || '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         || '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID          || '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID              || '',
};

// Must match the secret string in your Firestore security rules
export const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'changeme_set_in_env';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
