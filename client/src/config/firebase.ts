import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: "AIzaSyDR1_E4WtIlEvziUj48g7_PZiahG7dfZDc",

  authDomain: "cinenova-5bab5.firebaseapp.com",

  projectId: "cinenova-5bab5",

  storageBucket: "cinenova-5bab5.firebasestorage.app",

  messagingSenderId: "557537377663",

  appId: "1:557537377663:web:f9e223a94b638609f6ae4a",

  measurementId: "G-7BG6Q0E7Y1"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);