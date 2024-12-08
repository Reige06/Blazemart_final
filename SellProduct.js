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

  const handleSubmit = () => {
    if (photos.length > 0 && contactNumber && email && category) {
      navigation.navigate("Marketplace", {
        notification: {
          title: "Success!",
          description:
            "Your product has been saved in our servers. Please wait for the approval, Thank you!",
        },
      });
    } else {
      Alert.alert("Please fill all the information");
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
            <TouchableOpacity onPress={handleAddPhoto}>
              <Text style={styles.photoCountText}>
                {`${photos.length}/10 Select a Photo of your Product.\nThe first photo is your main photo of your product.`}
              </Text>
            </TouchableOpacity>
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
              <RadioButton
                value="new"
                status={condition === "new" ? "checked" : "unchecked"}
                onPress={() => setCondition("new")}
              />
              <Text style={styles.radioLabel}>New</Text>
              <RadioButton
                value="used - like new"
                status={
                  condition === "used - like new" ? "checked" : "unchecked"
                }
                onPress={() => setCondition("used - like new")}
              />
              <Text style={styles.radioLabel}>Used - Like New</Text>
              <RadioButton
                value="used - good"
                status={condition === "used - good" ? "checked" : "unchecked"}
                onPress={() => setCondition("used - good")}
              />
              <Text style={styles.radioLabel}>Used - Good</Text>
              <RadioButton
                value="used - fair"
                status={condition === "used - fair" ? "checked" : "unchecked"}
                onPress={() => setCondition("used - fair")}
              />
              <Text style={styles.radioLabel}>Used - Fair</Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity
              style={styles.categoryContainer}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={styles.categoryText}>
                {category || "Select Category"}
              </Text>
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
              <Text style={styles.modalTitle}>Select a Product Category</Text>
              <ScrollView>
                {[
                  "Pick a Category",
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
    marginBottom: 20,
  },
  photoBox: {
    width: 390,
    height: 390,
    backgroundColor: "#FFF",
    borderWidth: 7,
    borderRadius: 10,
    borderColor: "#4E56A0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
  photoCountText: {
    fontSize: 13,
    color: "#4E56A0",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "left",
    marginLeft: 5,
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
    width: 40,
    height: 40,
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
  conditionContainer: {
    backgroundColor: "#FFF",
    borderWidth: 4,
    borderColor: "#4E56A0",
    borderRadius: 5,
    padding: 10,
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  conditionIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  conditionTitle: {
    color: "#4E56A0",
    fontSize: 16,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  radioLabel: {
    marginRight: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
