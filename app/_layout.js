import { View, Text, AppState } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { FriendContextProvider } from "../context/friendContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertProvider } from "../context/alertContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, //Shows even if u r in app
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();

  const segments = useSegments();
  const appState = useRef(AppState.currentState);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Time spent today in milliseconds
  const [timerRunning, setTimerRunning] = useState(false);

  // Store the start time when the app opens
  useEffect(() => {
    startTimer()
    const checkPreviousSession = async () => {
      try {
        const lastActiveDate = await AsyncStorage.getItem("lastActiveDate");
        const today = new Date().toLocaleDateString();

        if (lastActiveDate !== today) {
          console.log("Day changed");
          await AsyncStorage.setItem("lastActiveDate", today);
          await AsyncStorage.setItem("elapsedTime", "0");
          setElapsedTime(0); // Reset elapsed time if it's a new day
        } else {
          const savedTime = await AsyncStorage.getItem("elapsedTime");
          console.log("Saved Time :", savedTime);
          setElapsedTime(Number(savedTime) || 0);
        }
      } catch (error) {
        console.error("Error checking previous session:", error);
      }
    };

    checkPreviousSession();

    return () => {
      if (timerRunning) {
        stopTimer();
      }
    };
  }, []);

  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(async (token) => {
      if (auth.currentUser?.uid) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { pushToken: token });
      }
    });

    return () => subscription.remove();
  }, []);

  // Start timer when app is active
  const startTimer = async () => {
    console.log("Timer started");
    setStartTime(Date.now());
    setTimerRunning(true);

    // Set up a timer to update elapsed time every minute
    setInterval(async () => {
      if (timerRunning) {
        
        const currentTime = Date.now();
        const timeSpentToday = currentTime - startTime + (elapsedTime || 0);
        console.log("Updating elapsed time every minute: ", timeSpentToday);
        await AsyncStorage.setItem("elapsedTime", timeSpentToday.toString());
        setElapsedTime(timeSpentToday);
      }
    }, 60000); // Update every 60,000 ms (1 minute)
  };

  // Stop timer and save to AsyncStorage
  const stopTimer = async () => {
    console.log("Timer stopped");
    if (startTime) {
      const currentTime = Date.now();
      const timeSpentToday = currentTime - startTime + (elapsedTime || 0);
      console.log(currentTime,startTime,elapsedTime)
      console.log("Setting elpased time :", timeSpentToday);
      await AsyncStorage.setItem("elapsedTime", timeSpentToday.toString());
      setElapsedTime(timeSpentToday);
    }
    setTimerRunning(false);
  };

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
              activeRoom: null,
            });

            stopTimer();
          } else if (nextAppState === "active") {
            // Update Firestore on foreground
            await updateDoc(userRef, {
              status: "online",
              lastSeen: "online",
            });

            startTimer();
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

function RootWithAuth() {
  const { user } = useAuth();
  return (
    <FriendContextProvider userId={user?.userId}>
      <SafeAreaProvider>
        <MenuProvider>
          <MainLayout />
        </MenuProvider>
      </SafeAreaProvider>
    </FriendContextProvider>
  );
}
export default function RootLayout() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AlertProvider>
          <AuthContextProvide>
            <RootWithAuth />
          </AuthContextProvide>
        </AlertProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
