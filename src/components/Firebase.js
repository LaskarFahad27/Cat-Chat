// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZTauOwfhx9nRPxdZtfgJ8567NeyHCIf0",
  authDomain: "cat-chat-c509c.firebaseapp.com",
  databaseURL: "https://cat-chat-c509c-default-rtdb.firebaseio.com",
  projectId: "cat-chat-c509c",
  storageBucket: "cat-chat-c509c.firebasestorage.app",
  messagingSenderId: "469642819083",
  appId: "1:469642819083:web:e23fc6c48ae6bb66f7b90e"
};

// Initialize Firebase
const progrm = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db = getFirestore(progrm);
export default progrm;

