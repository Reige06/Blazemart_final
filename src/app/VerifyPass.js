import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function VerifyPass() {
  const navigation = useNavigation();
  const [timer, setTimer] = useState(180);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleBackPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  const handleResendPress = () => {
    setTimer(180);
    setIsResendDisabled(true);
  };

  const [otpCode, setOtpCode] = useState("");

  const handleSubmitPress = () => {
    // Start the overlay fade-in animation and show the loading indicator
    setIsLoading(true);
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Wait for 2 seconds and then navigate to CreatePass.js
    setTimeout(() => {
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
        navigation.navigate("CreatePass");
      });
    }, 2000);
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <LinearGradient
            colors={["#D66464", "#703434"]}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.title}>Account Recovery</Text>
        <Text style={styles.subtitle}>
          We’ve sent you a 6-digit OTP Code to your Email Address
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter OTP Code"
          placeholderTextColor="#555"
          keyboardType="numeric"
          maxLength={6} 
          onChangeText={(text) => {
            
            const numericText = text.replace(/[^0-9]/g, "");
            setOtpCode(numericText); 
          }}
          value={otpCode} 
        />

        <Text style={styles.timer}>{timer}s</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitPress}
        >
          <LinearGradient
            colors={["#D66464", "#703434"]}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendPress}
          disabled={isResendDisabled}
        >
          <Text
            style={[
              styles.resendText,
              { color: isResendDisabled ? "#494949" : "#FFFFFF" },
            ]}
          >
            Resend
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Overlay with loading indicator */}
      {isLoading && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
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
  timer: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 20,
    borderColor: "#F2A4A4",
    borderWidth: 3,
  },
  submitButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendText: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
