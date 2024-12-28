import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useState, useEffect, useId } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // on Auth State changed
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log("Current user : ", user);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unSub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let data = docSnap.data()
      setUser({...user, profileName : data.profileName, userId : data.userId})
    }
  };

  const login = async (email, password) => {
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid Email";
      }
      return { success: false, msg };
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.message, error: error };
    }
  };

  const register = async (email, password, profileName) => {
    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Respo.user : ", resp?.user);

      await setDoc(doc(db, "users", resp?.user?.uid), {
        profileName,
        userId: resp?.user?.uid,
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
      }
      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
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
