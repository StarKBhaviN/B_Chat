import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { router, Slot, useSegments } from "expo-router";

import "../global.css";
import { AuthContextProvide, useAuth } from "../context/authContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  useEffect(()=>{
    // Check if user is Authenticated or not
    if (typeof isAuthenticated==='undefined') return

    const inApp = segments[0] == '(app)';

    if(isAuthenticated && !inApp){
      // Redirect to Home
      router.replace('home')
    }else if (isAuthenticated == false) {
      // Redirect to Login/SignUp
      router.replace('signIn')
    }
  }, [isAuthenticated])

  return <Slot />
};

export default function RootLayout() {
  return (
    <AuthContextProvide>
      <MainLayout />
    </AuthContextProvide>
  );
}
