import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, usersRef } from "../firebaseConfig";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/notifications";

// Google Sign-In Config
// GoogleSignin.configure({
//   webClientId: "586039025777-qpdlags9ljpnt1172jac0ossp16vdlmf.apps.googleusercontent.com",
// });

export const AuthContext = createContext();

export const AuthContextProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  // Function to update user's online status
  const updateUserStatus = async (userId, status, lastSeen) => {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { status, lastSeen: lastSeen }); // Update user status
  };

  useEffect(() => {
    // on Auth State changed
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserStatus(user.uid, "online", "online");
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unSub();
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        profileName: data.profileName,
        profileURL: data.profileURL,
        email: data.email,
        userId: data.userId,
        friends: data.friends,
        status: data.status,
        lastSeen: data.lastSeen,
      });
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Retrieve the current user's ID
      const userId = auth.currentUser?.uid;

      // Get the Expo Push Token
      const pushToken = await registerForPushNotificationsAsync();

      // Save the token to Firestore
      if (userId && pushToken) {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, { pushToken });
      }
      return { success: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid Email";
      } else if (
        msg.includes("(auth/user-not-found)") ||
        msg.includes("(auth/wrong-password)")
      ) {
        msg = "Please login with correct credentials";
      }
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      // Update user status before logout
      if (user?.userId) {
        await updateDoc(doc(usersRef, user.userId), {
          status: "disconnected",
          lastSeen: serverTimestamp(),
          pushToken: null,
        });
      }

      // Proceed with sign-out
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error: ", error);
      return { success: false, msg: error.message, error: error };
    }
  };

  const register = async (email, password, profileName, profileURL, bio) => {
    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);

      // Get the Expo Push Token
      const pushToken = await registerForPushNotificationsAsync();

      // Save user data along with the image URL to Firestore
      await setDoc(doc(db, "users", resp?.user?.uid), {
        profileName,
        profileURL: profileURL, // Save the uploaded image URL or the original URL
        email: email,
        bio: bio,
        userId: resp?.user?.uid,
        status: "online",
        pushToken: pushToken || null, // Save the token
      })
        .then(() => {
          console.log("User document created successfully.");
        })
        .catch((error) => {
          console.error("Error creating user document: ", error);
        });

      return { success: true, data: resp?.user };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid Email";
      } else if (msg.includes("(auth/weak-password)")) {
        msg = "Password length must be atleast 6 charecters.";
      }
      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        // signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
