import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  View,
  Alert, // Import Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./AuthProvider";

export default function Login() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { signIn, isLoading } = useContext(AuthContext);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: -150,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    const { error } = await signIn(email, password);

    if (error) {
      if (error.type === "invalid_credentials") {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      } else if (error.type === "invalid_password") {
        Alert.alert("Login Failed", "Invalid password. Please check and retry.");
      } else {
        Alert.alert("Login Failed", error.message);
      }
    } else {
      navigation.navigate("dashboard", { screen: "Homepage" });
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY: moveAnim }] }]}
      >
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>BLAZEMART</Text>
        <Text style={styles.subtitle}>
          "Shop Smart, BlazeMart"{"\n"}The Trailblazers' Marketplace
        </Text>
      </Animated.View>

      <Animated.View style={[styles.fadeContainer, { opacity: fadeAnim }]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.passwordField}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#4E56A0", "#252A55"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "LOGIN" : "LOGIN"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPass")}
          disabled={isLoading}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            {"\n"}Create your Account here
          </Text>
        </Text>
      </Animated.View>

      {isLoading && (
        <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
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
    paddingHorizontal: 20,
  },
  fadeContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 430,
    marginBottom: 20,
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "800",
    fontStyle: "italic",
    marginVertical: 10,
  },
  input: {
    width: "75%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 5,
    textAlign: 'left',
    borderColor: "#7190BF",
    borderWidth: 2,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#7190BF",
    borderWidth: 2,
    marginVertical: 5,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: "#4e5d94",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    width: "80%",
    marginTop: 5,
  },
  button: {
    width: "45%",
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Times New Roman",
    fontSize: 30,
    fontWeight: "bold",
  },
  registerText: {
    color: "#000",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  registerLink: {
    color: "#4e5d94",
    fontWeight: "800",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  adminButton: {
    width: 50,
    height: 50,
    backgroundColor: "#4E56A0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  adminIcon: {
    width: 30,
    height: 30,
  },
});
