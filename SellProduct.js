import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";
import { AuthContext } from "./AuthProvider";

const SellProduct = ({ navigation }) => {
  const { user, isLoading } = useContext(AuthContext); // Get user and loading state from AuthContext
  const [photos, setPhotos] = useState([]);
  const [condition, setCondition] = useState("new");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleAddPhoto = async () => {
    if (photos.length < 10) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const photo = result.assets[0];
        const fileName = `${Date.now()}_${photo.uri.split('/').pop()}`;

        try {
          // Upload the file
          const { data, error } = await supabase.storage
            .from('product_bucket')
            .upload(fileName, {
              uri: photo.uri,
              type: 'image/jpeg', // Adjust MIME type if needed
              name: fileName,
            });

          if (error) throw new Error(`Upload error: ${error.message}`);

          // Retrieve the public URL
          const { data: urlData } = supabase.storage
            .from('product_bucket')
            .getPublicUrl(fileName);

          if (!urlData.publicUrl) {
            throw new Error('Unable to retrieve public URL.');
          }

          // Add the public URL to the photos array
          setPhotos([...photos, urlData.publicUrl]);
        } catch (err) {
          console.error('Error during upload:', err.message);
          Alert.alert('Error', 'Failed to upload photo. Please try again.');
        }
      }
    } else {
      Alert.alert('Maximum 10 photos allowed');
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };
  

  const handleSubmit = async () => {
    // Validate input fields
    if (!productName || photos.length === 0 || !category) {
      Alert.alert("Incomplete Information", "Please fill in all fields.");
      return;
    }
  
    try {
      const firstPhoto = photos[0]; // Use the first photo from the photos array
  
      // Check if user ID is available
      console.log("User ID being used for product submission:", user.id);
  
      // Insert product data into the Supabase database
      const { error: dbError } = await supabase.from("products").insert([
        {
          user_id: user.id, // Match the column name in the table
          product_name: productName, // Match column name for product name
          product_descrip: productDescription, // Match column name for description
          product_img: firstPhoto, // Use the first photo's public URL
          product_cond: condition, // Use the selected condition
          category, // Use the selected category
        },
      ]);
  
      if (dbError) {
        throw new Error(`Database insertion error: ${dbError.message}`);
      }
  
      Alert.alert(
        "Success!",
        "Your product has been submitted successfully. Await approval!"
      );
      navigation.navigate("Marketplace");
    } catch (error) {
      console.error("Error during product submission:", error.message);
      Alert.alert(
        "Error",
        error.message || "Failed to submit product. Please try again."
      );
    }
  };
  
  

  return (
    <ImageBackground
      source={require("./assets/sell/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNavigation}>
          <TouchableOpacity onPress={() => navigation.navigate("Marketplace")}>
            <Image
              source={require("./assets/sell/back.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Sell a Product</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Image
              source={require("./assets/sell/check.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Add Photos Section */}
          <View style={styles.photosContainer}>
            <ScrollView horizontal>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoBox}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Image
                      source={require("./assets/sell/remove_photo.png")}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 10 && (
                <TouchableOpacity style={styles.photoBox} onPress={handleAddPhoto}>
                  <Image
                    source={require("./assets/sell/photo_add.png")}
                    style={styles.addPhotoIcon}
                  />
                  <Text style={styles.insertPhotoText}>Insert a Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
            {/* Product Details Section */}
            <View style={styles.section}>
            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={productName} // Bind value to state
              onChangeText={setProductName} // Update state on change
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={productDescription} // Bind value to state
              onChangeText={setProductDescription} // Update state on change
              multiline
            />
          </View>

          {/* Condition Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.radioGroup}>
              {["new", "used - like new", "used - good", "used - fair"].map((cond) => (
                <View key={cond} style={styles.radioItem}>
                  <RadioButton
                    value={cond}
                    status={condition === cond ? "checked" : "unchecked"}
                    onPress={() => setCondition(cond)}
                  />
                  <Text style={styles.radioLabel}>{cond.replace("-", " - ")}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
              <Image
                source={require("./assets/sell/categories_popup_scroll.png")}
                style={styles.categoryIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Categories Modal */}
        <Modal visible={isCategoryModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                {[
                  "Electronics",
                  "Furniture",
                  "Food",
                  "Arts and Crafts",
                  "Home",
                  "Education",
                  "Health and Beauty",
                  "Clothing",
                  "Toys and Games",
                  "Sports",
                  "Jewelry",
                  "Miscellaneous",
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <View style={styles.modalItem}>
                      <RadioButton
                        value={cat}
                        status={category === cat ? "checked" : "unchecked"}
                        onPress={() => {
                          setCategory(cat);
                          setCategoryModalVisible(false);
                        }}
                      />
                      <Text style={styles.modalItemText}>{cat}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default SellProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4E56A0",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  navIcon: {
    width: 25,
    height: 25,
  },
  navTitle: {
    color: "#FFF",
    fontSize: 18,
 fontWeight: "bold",
  },
  scrollContainer: {
    padding: 15,
  },
  photosContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  photoBox: {
    width: 393,
    height: 395,
    backgroundColor: "#FFF",
    borderWidth: 4,
    borderColor: "#4E56A0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  addPhotoIcon: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  insertPhotoText: {
    color: "#4E56A0",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },
  removePhoto: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  removeIcon: {
    width: 30,
    height: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 3,
    backgroundColor: "#FFF",
    borderColor: "#4E56A0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  radioLabel: {
    marginRight: 10,
  },
  categoryIcon: {
    width: 25,
    height: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalItemText: {
    marginLeft: 10,
  },
});
