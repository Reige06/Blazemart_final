import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";
import { AuthContext } from "../AuthProvider";


const EditProfile = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, bio, profile_img")
          .eq("id", user.id)
          .single();

        if (error) throw new Error(error.message);

        setFullName(data.full_name);
        setBio(data.bio);
        setProfileImg(data.profile_img);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        Alert.alert("Error", "Failed to fetch profile data.");
      }
    };

    fetchProfileData();
  }, [user.id]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setProfileImg(selectedImage.uri);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!fullName || !profileImg) {
      Alert.alert("Incomplete Information", "Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fileName = `${Date.now()}_${profileImg.split("/").pop()}`;
      const { data, error: uploadError } = await supabase.storage
        .from("profile_bucket")
        .upload(fileName, { uri: profileImg, type: "image/jpeg", name: fileName });

      if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

      const { data: urlData } = supabase.storage.from("profile_bucket").getPublicUrl(fileName);
      if (!urlData.publicUrl) {
        throw new Error("Unable to retrieve public URL.");
      }

      const { error: dbError } = await supabase
        .from("users")
        .upsert([{ id: user.id, full_name: fullName, bio, profile_img: urlData.publicUrl }]);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      Alert.alert("Success", "Your profile has been updated!");
      navigation.goBack();
    } catch (error) {
      console.error("Error during profile save:", error.message);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
    >
      {/* Top Navigation */}
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/search_category/back.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
      </View>

      <View style={styles.container}>
        {/* Wrapper for profile image picker, name, bio, and submit button */}
        <View style={styles.formContainer}>
          {/* Profile Image Picker */}
          <Text style={styles.label}>Profile Image</Text>
          <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePickerText}>Select Profile Picture</Text>
            )}
          </TouchableOpacity>

          {/* Full Name Input */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />

          {/* Bio Input */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
            multiline
          />

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E56A0",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: "relative",
    justifyContent: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
    marginRight: 300,
  },
  navTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    transform: [{ translateY: 20 }],
    width: 100,
    
  },
  formContainer: {
    backgroundColor: "#4E56A0",
    alignItems: "center",
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 80,
  },
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "800",
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
  },
  submitButtonText: {
    color: "#4E56A0",
    fontSize: 16,
  },
});

export default EditProfile;
