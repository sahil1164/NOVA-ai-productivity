import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("googleToken");

    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // logout function
  const logout = async () => {
    localStorage.removeItem("googleToken");

    setAccessToken(null);

    await signOut(auth);
  };
  console.log("AUTH CONTEXT TOKEN:", accessToken);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        accessToken,
        setAccessToken,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}