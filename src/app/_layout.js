import React, { useContext, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, ImageBackground, SafeAreaView, Image, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext, AuthProvider } from "./AuthProvider";
import { StatusBar } from "react-native";
import Register from "./Register";
import ForgotPass from "./ForgotPass";
import Login from "./Login";
import DashboardLayout from "./dashboard/_layout";







const Stack = createStackNavigator();

function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.title}>BLAZEMART</Text>
          <Text style={styles.subtitle}>
            "Shop Smart, BlazeMart"{"\n"}The Trailblazers' Marketplace
          </Text>
          <View style={styles.footer}>
            <Image
              source={require("../assets/ustp.png")}
              style={styles.footerImage}
            />
            <Text style={styles.footerText}>
              USTP - CDO 2024 © All Rights Reserved
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // Show a loading spinner while authentication state is loading
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If no user is logged in, redirect to Login
  return user ? children : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Public Screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPass" component={ForgotPass} />
          <Stack.Screen name="Register" component={Register} />

          {/* Protected Screens */}
          <Stack.Screen name="dashboard" component={DashboardLayout} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
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
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    color: "#000",
    fontSize: 45,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#000",
    fontSize: 17,
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "800",
    marginVertical: 10,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  footerImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  footerText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});