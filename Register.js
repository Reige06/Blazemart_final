import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "./supabase";

export default function Register() {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [corUri, setCorUri] = useState(null);
  const [corName, setCorName] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUploadCOR = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log("DocumentPicker result:", result);

      if (result.canceled) {
        Alert.alert("Cancelled", "You did not select any file.");
      } else {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;
        setCorUri(fileUri);
        setCorName(fileName);
        Alert.alert("File Selected", `COR file selected successfully:\n${fileName}`);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      Alert.alert("Error", "An unexpected error occurred during file selection.");
    }
  };

  const handleSignUp = async () => {
    if (!fullname || !email || !studentId || !password || !confirmPassword || !corUri) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
  
    if (password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Step 1: Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (authError) {
        console.error("Auth Sign-Up Error:", authError);
        Alert.alert("Error", "Failed to sign up.");
        setLoading(false);
        return;
      }
  
      const userId = authData.user.id;

      // Step 3: Upload the COR file
      const fileName = `${studentId}_cor.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cor_bucket")
        .upload(fileName, {
          uri: corUri,
          name: fileName,
          type: "application/pdf",
        });

      if (uploadError) {
        console.error("Error uploading COR:", uploadError);
        Alert.alert("Error", "Failed to upload COR.");
        return;
      }

      const corUrl = supabase.storage.from("cor_bucket").getPublicUrl(fileName).data.publicUrl;
  
      // Step 2: Insert user data into the users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          full_name: fullname,
          email,
          student_id: parseInt(studentId, 10),
          cor_url: corUrl, // Placeholder until the file is uploaded
        },
      ]);
  
      if (insertError) {
        console.error("Database Insertion Error:", insertError);
        Alert.alert("Error", "Failed to save user data.");
        setLoading(false);
        return;
      }
      await supabase.auth.signOut();
      Alert.alert("Registration successful!", "Check email for verification", [{ text: "OK", onPress: () => navigation.navigate("Login") }]);
    } catch (error) {
      console.error("Unexpected Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <ImageBackground source={require("./assets/background.jpg")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>BLAZEMART</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#555"
          value={fullname}
          onChangeText={setFullname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          placeholderTextColor="#555"
          value={studentId}
          onChangeText={setStudentId}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadCOR}>
          <Text style={styles.uploadButtonText}>
            {corName ? `Selected: ${corName}` : "Upload COR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          <LinearGradient
            colors={["#4E56A0", "#252A55"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
        >
          <Text style={styles.loginLink}>Already have an account? Login</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handleTest}>
  <LinearGradient
    colors={["#4E56A0", "#252A55"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.buttonGradient}
  >
    <Text style={styles.buttonText}>Test Insert</Text>
  </LinearGradient>
</TouchableOpacity> */}

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    color: "#000",
    fontSize: 45,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#333",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "800",
    fontStyle: "italic",
    marginVertical: 10,
  },
  input: {
    width: "80%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 5,
    textAlign: "center",
    borderColor: "#7190BF",
    borderWidth: 2,
  },
  uploadButton: {
    width: "80%",
    height: 45,
    backgroundColor: "#4E56A0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#4e5d94",
    textDecorationLine: "underline",
    fontWeight: "800",
    marginTop: 10,
  },
});