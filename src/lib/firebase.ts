import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_hQNDC_9IMTSf4gH7Csp_VN7Rf-9Y5h4",
  authDomain: "agriguru-4d713.firebaseapp.com",
  projectId: "agriguru-4d713",
  storageBucket: "agriguru-4d713.firebasestorage.app",
  messagingSenderId: "765300183345",
  appId: "1:765300183345:web:42f7a7ab093259117e2010",
  measurementId: "G-PX3SEDCREQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
