import React, { useState, useRef, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "./supabase";


export default function ProfilePage() {
  
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [fullName, setFullName] = useState("Loading...");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          return;
        }
  
        if (!session || !session.user) {
          console.error("No user is logged in.");
          return;
        }
  
        const userId = session.user.id; // Get the user's ID
        console.log("Current User ID:", userId); // Debugging
  
        // Fetch the user's full_name from the users table
        const { data, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .single();
  
        if (error) {
          console.error("Error fetching user data:", error.message);
        } else {
          setFullName(data.full_name || "Unnamed User");
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = async () => {
    try {
      setShowModal(false);
      setLoading(true);
  
      // End the user's session with Supabase
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error("Error during logout:", error.message);
        return;
      }
  
      // Navigate back to the login page
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Ensure login is the only route in the stack
      });
    } catch (err) {
      console.error("Unexpected error during logout:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={styles.background}
        >
          <View style={styles.topContainer}>
            <Image source={require("./assets/logo.png")} style={styles.logo} />
            <Text style={styles.logoText}>BLAZEMART</Text>
            <View style={styles.topIcons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MySavedPage")}
              >
                <Image
                  source={require("./assets/home/heart.png")}
                  style={styles.topIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("MessagePage")}
              >
                <Image
                  source={require("./assets/home/message.png")}
                  style={styles.message_topIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.profileContainer}>
            <Image
              source={require("./assets/profile/profile_icon.png")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{fullName}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.background_for_actionContainer}>
              <TouchableOpacity style={styles.actionButton}
              onPress={() => navigation.navigate("MyProfile")}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={require("./assets/profile/profile_icon.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require("./assets/profile/edit_profile.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require("./assets/profile/setting.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLogout}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={require("./assets/profile/logout.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("./assets/navigation/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Marketplace")}
        >
          <Image
            source={require("./assets/navigation/marketplace.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.navCircle}
        onPress={() => navigation.navigate("Notification")}
        >
          <Image
            source={require("./assets/navigation/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profile_navCircle}>
          <Image
            source={require("./assets/navigation/profile.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7190BF",
  },
  backgroundContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: 35,
  },
  logo: {
    width: 100,
    height: 50,
    left: 10,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 20, // Adjust the size to match the logo height visually
    fontWeight: "bold", // Optional styling for emphasis
    color: "#201B51", // Set a color that matches your theme
    right: 20,
    bottom: 5,
    height: 50, // Same height as the logo
    lineHeight: 50, // Center the text vertically within its container
  },
  topIcons: {
    flexDirection: "row",
    right: 33,
  },
  topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    backgroundColor: "#4E56A0",
    borderRadius: 30,
  },
  message_topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    borderRadius: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "#FFF",
    borderWidth: 3,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },

  actionContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 16, // Optimized padding
  },

  background_for_actionContainer: {
    marginTop: 20,
    borderRadius: 20, // Smaller for smoother corners
    paddingVertical: 15, // Consistent inner padding
    paddingHorizontal: 16,
    backgroundColor: "#4E56A0",
    alignItems: "center",
    width: "80%", // Ensures better adaptability to different screen sizes
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7190BF",
    paddingVertical: 14, // Balanced vertical padding
    paddingHorizontal: 18, // Improved horizontal padding
    borderRadius: 12, // Slightly rounded corners
    marginVertical: 8, // Reduced spacing between buttons
    width: "90%", // Utilize full width of the container
    elevation: 3, // Add slight shadow for better contrast
  },

  iconContainer: {
    width: 50, // Adjusted to balance button size
    height: 50,
    backgroundColor: "#4E56A0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20, // Balanced spacing between icon and text
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },

  iconImage: {
    width: 32, // Resized for consistency
    height: 32,
    resizeMode: "contain",
  },

  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "left",
    marginLeft: 25,
    flex: 1, // Allow text to expand if needed
  },

  bottomNavigation: {
    height: 90,
    backgroundColor: "#7190BF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profile_navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: 300,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#4E56A0",
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
