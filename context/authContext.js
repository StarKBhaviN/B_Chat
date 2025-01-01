import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Google Sign-In Config
// GoogleSignin.configure({
//   webClientId: "586039025777-qpdlags9ljpnt1172jac0ossp16vdlmf.apps.googleusercontent.com",
// });

export const AuthContext = createContext();

export const AuthContextProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // on Auth State changed
    const unSub = onAuthStateChanged(auth, (user) => {
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
    const docSnap = await getDoc(docRef);

    console.log(docSnap)
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        profileName: data.profileName,
        profileURL: data.profileURL,
        userId: data.userId,
        friends : data.friends
      });
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

  // Function to upload the profile image to Firebase Storage
  const uploadProfileImage = async (uri, userId) => {
    const storage = getStorage();
    const response = await fetch(uri); // Fetch image from URI
    const blob = await response.blob(); // Convert the image to a blob

    const imageRef = ref(storage, `profileImages/${userId}`);
    await uploadBytes(imageRef, blob); // Upload the image to Firebase Storage
    const imageURL = await getDownloadURL(imageRef); // Get the download URL of the image
    console.log("Done UploadProfileImage")
    return imageURL;
  };

  const register = async (email, password, profileName, profileURL) => {
    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);

      console.log("Profile URL : ",profileURL)
      // Upload the profile image to Firebase Storage
      let uploadedImageURL = null;
      if (profileURL) {
        uploadedImageURL = await uploadProfileImage(
          profileURL,
          resp?.user?.uid
        );
      }
      console.log("Uplaoded URL : ",profileURL)


      // Save user data along with the image URL to Firestore
      await setDoc(doc(db, "users", resp?.user?.uid), {
        profileName,
        profileURL: uploadedImageURL || profileURL, // Save the uploaded image URL or the original URL
        email : email,
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
