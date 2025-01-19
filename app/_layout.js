import { View, Text, AppState } from "react-native";
import React, { useEffect, useRef } from "react";
import { router, Slot, useSegments } from "expo-router";

import "../global.css";
import { AuthContextProvide, useAuth } from "../context/authContext";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db, usersRef } from "../firebaseConfig";
import ThemeProvider from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, //Shows even if u r in app
    shouldPlaySound: true,
    shouldSetBadge: true,
    
  }),
});

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  const appState = useRef(AppState.currentState);
  const { user } = useAuth();

  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(async (token) => {
      if (auth.currentUser?.uid) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { pushToken: token });
      }
    });

    return () => subscription.remove();
  }, []);

  // App state change online/offline
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

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [user]);

  // Verifies login status
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
    <NotificationProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <MenuProvider>
            <AuthContextProvide>
              <MainLayout />
            </AuthContextProvide>
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
