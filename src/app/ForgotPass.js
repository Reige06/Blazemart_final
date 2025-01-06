import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPass() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start with the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleBackPress = () => {
    // Start the fade-out animation when the back button is pressed
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate("Login"); // Navigate after the animation completes
    });
  };

  const handleNextPress = () => {
    // Trigger loading state and fade-in overlay animation
    setLoading(true);
    Animated.timing(overlayAnim, {
      toValue: 1, // Fade in the overlay
      duration: 500, // 500ms fade-in duration
      useNativeDriver: true,
    }).start(() => {
      // Wait 2 seconds before navigating to VerifyPass.js
      setTimeout(() => {
        Animated.timing(overlayAnim, {
          toValue: 0, // Fade out the overlay
          duration: 500, // 500ms fade-out duration
          useNativeDriver: true,
        }).start(() => {
          setLoading(false);
          navigation.navigate("VerifyPass");
        });
      }, 2000);
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress} // Use the new handler here
        >
          <LinearGradient
            colors={["#D66464", "#703434"]}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.title}>Account Recovery</Text>
        <Text style={styles.subtitle}>
          Forgot Credentials? We’ve got you covered!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <LinearGradient
            colors={["#D66464", "#703434"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Loading Overlay with Fade Animation */}
      {loading && (
        <Animated.View
          style={[
            styles.loadingOverlay,
            { opacity: overlayAnim }, // Bind opacity to overlayAnim value
          ]}
        >
          <ActivityIndicator size="large" color="#fff" />
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    borderWidth: 3,
    borderColor: "#F2A4A4",
    borderRadius: 25,
    overflow: "hidden",
  },
  backButtonGradient: {
    padding: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
    borderColor: "#F2A4A4",
    borderWidth: 3,
  },
  nextButton: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 20,
    borderColor: "#F2A4A4",
    borderWidth: 3,
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensures it is above all other content
  },
});
