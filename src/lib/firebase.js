import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  //apiKey: import.meta.env.VITE_API_KEY,
  apiKey: "AIzaSyA0-oyVxot__0dOPQ4MDWUW1OWjio3s2oI",
  authDomain: "reactchat-72696.firebaseapp.com",
  projectId: "reactchat-72696",
  storageBucket: "reactchat-72696.appspot.com",
  messagingSenderId: "1077991689715",
  appId: "1:1077991689715:web:5f98c1a2c15a7c84bb9686"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);