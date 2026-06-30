import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvwJUbWSvOY7aeev91vvns4S5ttHOaGQg",
  authDomain: "nova-7c203.firebaseapp.com",
  projectId: "nova-7c203",
  storageBucket: "nova-7c203.firebasestorage.app",
  messagingSenderId: "531599901966",
  appId: "1:531599901966:web:8a54089513def28bf2435f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;