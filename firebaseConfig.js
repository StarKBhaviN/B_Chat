import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
  GoogleAuthProvider,
} from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyC_yRIGciCxmoH8klTtvUiAY4vHs_ZtAPE",
  authDomain: "b-chat-a9a15.firebaseapp.com",
  projectId: "b-chat-a9a15",
  storageBucket: "b-chat-a9a15.appspot.com",
  messagingSenderId: "586039025777",
  appId: "1:586039025777:web:2620d940bfeb3c77a7bbd0",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore Database
export const db = getFirestore(app);

// Firestore References
export const usersRef = collection(db, "users");
export const roomsRef = collection(db, "rooms");
// export const connectionRef = collection(db, "connections")
