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
      if (appState.current === "active" && nextAppState === "background") {
        // App goes to background (not closed, just backgrounded)
        if (user?.userId) {
          await updateDoc(doc(usersRef, user.userId), {
            status: "offline",
            lastSeen: serverTimestamp(),
          });
        }
      } else if (nextAppState === "active") {
        // App comes to foreground
        if (user?.userId) {
          await updateDoc(doc(usersRef, user.userId), {
            status: "online",
            lastSeen : "online"
          });
        }
      } // Also consider the "inactive" state, though it's rarely used
      else if (nextAppState === "inactive") {
        console.log("App is inactive");
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
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
