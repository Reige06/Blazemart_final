import React, { createContext, useState, useEffect } from "react";
import { supabase } from "./supabase"; // Import your Supabase client

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        console.log("User logged in:", session.user.id);
      } else {
        setUser(null);
        console.log("No user is logged in.");
      }
      setIsLoading(false);
    });
  
    // Fetch the initial session asynchronously
    const fetchInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
        } else if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Error fetching initial session:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialSession();
  
    // Cleanup the subscription properly
    return () => {
      if (subscription) {
        subscription.unsubscribe?.(); // Safely call unsubscribe if it exists
      }
    };
  }, []);

  // Helper function to log in
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

  // Helper function to log out
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
