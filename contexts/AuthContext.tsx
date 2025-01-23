"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  emailGlobal: string;
  setEmailGlobal: (email: string) => void;
  nameGlobal: string;
  setNameGlobal: (name: string) => void;
  session?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [emailGlobal, setEmailGlobal] = useState("");
  const [nameGlobal, setNameGlobal] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setIsSignedIn(true);
      setEmailGlobal(session?.user?.email || "");
      setNameGlobal(session?.user?.name || "");
    } else if (status === "unauthenticated") {
      const tokenCookie = getCookie("token");
      const userEmail = getCookie("userEmail");
      const userName = getCookie("userName");

      if (tokenCookie) {
        setIsSignedIn(true);
        setEmailGlobal(userEmail as string);
        setNameGlobal(userName as string);
      } else {
        setIsSignedIn(false);
        setEmailGlobal("");
        setNameGlobal("");
      }
    }
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isSignedIn,
        setIsSignedIn,
        emailGlobal,
        setEmailGlobal,
        nameGlobal,
        setNameGlobal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
