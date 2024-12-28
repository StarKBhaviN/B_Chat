// Import the functions you need from the SDKs you need
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_yRIGciCxmoH8klTtvUiAY4vHs_ZtAPE",
  authDomain: "b-chat-a9a15.firebaseapp.com",
  projectId: "b-chat-a9a15",
  storageBucket: "b-chat-a9a15.firebasestorage.app",
  messagingSenderId: "586039025777",
  appId: "1:586039025777:web:2620d940bfeb3c77a7bbd0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app)

export const usersRef = collection(db, 'users')
export const roomsRef = collection(db, 'rooms')
