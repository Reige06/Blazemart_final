import React, { useState, useRef, useEffect } from "react";
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
import { supabase } from "../supabase";


export default function ProfilePage() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [fullName, setFullName] = useState("Loading...");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          return;
        }
  
        if (!session || !session.user) {
          console.error("No user is logged in.");
          return;
        }
  
        const userId = session.user.id;
        const { data, error } = await supabase
          .from("users")
          .select("full_name, profile_img")
          .eq("id", userId)
          .single();
  
        if (error) {
          console.error("Error fetching user data:", error.message);
        } else {
          setFullName(data.full_name || "Unnamed User");
          setProfileImage(data.profile_img || null);
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error.message);
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
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
          source={require("../../assets/background.jpg")}
          style={styles.background}
        >
          <View style={styles.topContainer}>
            <View style={styles.topIcon}>
              <Image
                source={require("../../assets/settings.png")}
                style={styles.backIcon}
              />
            </View>
            <Text style={styles.logoText}>Settings</Text>
          </View>

          {/* Profile Information */}
          <View style={styles.profileContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage } // Use fetched profile image
                  : require("../../assets/profile/profile_icon.png") // Fallback to default
              }
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{fullName}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.background_for_actionContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={require("../../assets/profile/profile_icon.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>View Profile</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("Edit")}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={require("../../assets/profile/edit_profile.png")}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.actionText}>Edit Profile</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLogout}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={require("../../assets/profile/logout.png")}
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
          onPress={() => navigation.navigate("Homepage")}
        >
          <Image
            source={require("../../assets/navigation/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Marketplace")}
        >
          <Image
            source={require("../../assets/navigation/marketplace.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Notif")}
        >
          <Image
            source={require("../../assets/navigation/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.profile_navCircle}>
          <Image
            source={require("../../assets/navigation/profile.png")}
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
    paddingVertical: 35,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#201B51",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 90,
    borderColor: "#FFF",
    borderWidth: 3,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#201B51",
  },
  actionContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  background_for_actionContainer: {
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: "#4E56A0",
    alignItems: "center",
    width: "80%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7190BF",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 8,
    width: "90%",
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#4E56A0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  iconImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "left",
    marginLeft: 25,
    flex: 1,
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
  bottomNavigation: {
    height: 95,
    backgroundColor: "#7190BF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  home_navCircle: {
    width: 65,
    height: 65,
    backgroundColor: "#4E56A0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    marginLeft: 20
  },
  topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    resizeMode: "contain",
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
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
});
