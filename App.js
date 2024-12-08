import React, { useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./AuthProvider"; // Import AuthProvider and AuthContext
import Login from "./Login";
import Register from "./Register";
import ForgotPass from "./ForgotPass";
import Home from "./Home";
import VerifyPass from "./VerifyPass";
import CreatePass from "./CreatePass";
import ProfilePage from "./ProfilePage";
import AdminLogin from "./dev/AdminLogin";
import AdminHome from "./dev/AdminHome";
import MySavedPage from "./MySavedPage";
import Marketplace from "./Marketplace";
import MessagePage from "./MessagePage";
import SellProduct from "./SellProduct";

const Stack = createStackNavigator();

function SplashScreen({ navigation }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Public Screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPass" component={ForgotPass} />
          <Stack.Screen name="Register" component={Register} />

          {/* Protected Screens */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="VerifyPass" component={VerifyPass} />
          <Stack.Screen name="CreatePass" component={CreatePass} />
          <Stack.Screen name="Marketplace" component={Marketplace} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="Admin_Login" component={AdminLogin} />
          <Stack.Screen name="Admin_Home" component={AdminHome} />
          <Stack.Screen name="MySavedPage" component={MySavedPage} />
          <Stack.Screen name="MessagePage" component={MessagePage} />
          <Stack.Screen name="SellProduct" component={SellProduct} />
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
