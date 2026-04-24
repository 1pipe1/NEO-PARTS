import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTNMHrTPpdvJwIMMLYM0WOWIeMKcMsrCY",
  authDomain: "e-commerce-upb.firebaseapp.com",
  projectId: "e-commerce-upb",
  storageBucket: "e-commerce-upb.firebasestorage.app",
  messagingSenderId: "1079251236768",
  appId: "1:1079251236768:web:7014cf061453a7821cd6c5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
