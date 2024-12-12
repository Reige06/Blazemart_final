import React, { createContext, useState, useEffect } from "react";
import { supabase } from "./supabase"; // Import your Supabase client

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log("Session user:", session.user); // Log the full user object
        setUser(session.user); // This should include the 'id'
      } else {
        console.log("No user is logged in.");
        setUser(null);
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
          console.log("Initial session user:", session.user); // Log the full user object
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