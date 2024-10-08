import { useSession } from "next-auth/react";
import React from "react";

interface Auth {
  loading: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
}
export default function useAuth(): Auth {
  const session = useSession();

  console.log("useAuth: session", session);
  return {
    loading: session.status === "loading",
    loggedIn: session.status === "authenticated",
    isAdmin: false,
  };
}
