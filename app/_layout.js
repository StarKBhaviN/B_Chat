import { View, Text, AppState } from "react-native";
import React, { useEffect, useRef } from "react";
import { router, Slot, useSegments } from "expo-router";

import "../global.css";
import { AuthContextProvide, useAuth } from "../context/authContext";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  const appState = useRef(AppState.currentState);
  const { user } = useAuth();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (user?.userId) {
        try {
          const userRef = doc(usersRef, user.userId);
  
          if (appState.current === "active" && nextAppState === "background") {
            // Update Firestore on background
            await updateDoc(userRef, {
              status: "offline",
              lastSeen: serverTimestamp(),
            });
          } else if (nextAppState === "active") {
            // Update Firestore on foreground
            await updateDoc(userRef, {
              status: "online",
              lastSeen: "online",
            });
          }
        } catch (error) {
          console.error("AppState update error: ", error);
        }
      }
      appState.current = nextAppState;
    };
  
    const subscription = AppState.addEventListener("change", handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, [user]);
  

  useEffect(() => {
    // Check if user is Authenticated or not
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] == "(app)";

    if (isAuthenticated && !inApp) {
      // Redirect to Home
      router.replace("home");
    } else if (isAuthenticated == false) {
      // Redirect to Login/SignUp
      router.replace("signIn");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthContextProvide>
          <MainLayout />
        </AuthContextProvide>
      </MenuProvider>
    </SafeAreaProvider>
  );
}
