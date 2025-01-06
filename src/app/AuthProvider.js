import React, { createContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log("Session user:", session.user);
        setUser(session.user);
      } else {
        console.log("No user is logged in.");
        setUser(null);
      }
      setIsLoading(false);
    });

    const fetchInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
        } else if (session) {
          console.log("Initial session user:", session.user);
          setUser(session.user);
        }
      } catch (err) {
        console.error("Error fetching initial session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Login error:", error.message);
        return { error };
      }
      console.log("Login successful for user:", data.user.id);
      return { data };
    } catch (err) {
      console.error("Error during sign-in:", err);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
      }
    } catch (err) {
      console.error("Error during sign-out:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Named and Default Exports
export { AuthProvider }; 
export default AuthProvider; 
