import React, { useState, useEffect } from "react";
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
} from "react-native";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";
import { useRoute } from "@react-navigation/native";

const EditProduct = ({ navigation }) => {
  const route = useRoute();
  const { product } = route.params || {};

  // State variables initialized with product data
  const [photos, setPhotos] = useState(product?.product_img ? [product.product_img] : []);
  const [condition, setCondition] = useState(product?.product_cond || "new");
  const [category, setCategory] = useState(product?.category || "");
  const [productName, setProductName] = useState(product?.product_name || "");
  const [productDescription, setProductDescription] = useState(product?.product_descrip || "");
  const [price, setPrice] = useState(product?.price ? product.price.toString() : "");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        Alert.alert("Error", "Failed to fetch user. Please log in again.");
        navigation.navigate("Login");
      } else {
        console.log("Current User:", user);
        setCurrentUser(user?.user || null);
      }
    };

    fetchUser();

    if (!product) {
      console.error("No product selected.");
      Alert.alert("Error", "No product selected.");
      navigation.navigate("MyProfile");
    }
  }, [product, navigation]);

  const handleAddPhoto = async () => {
    if (photos.length >= 10) {
      Alert.alert("Maximum 10 photos allowed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      const fileName = `${Date.now()}_${photo.uri.split("/").pop()}`;
      try {
        const { data, error } = await supabase.storage
          .from("product_bucket")
          .upload(fileName, {
            uri: photo.uri,
            type: "image/jpeg",
            name: fileName,
          });

        if (error) throw new Error(`Upload error: ${error.message}`);

        const { data: urlData, error: urlError } = supabase.storage
          .from("product_bucket")
          .getPublicUrl(fileName);

        if (urlError || !urlData.publicUrl) {
          throw new Error("Unable to retrieve public URL.");
        }

        setPhotos([...photos, urlData.publicUrl]);
      } catch (err) {
        console.error("Error during upload:", err.message);
        Alert.alert("Error", "Failed to upload photo. Please try again.");
      }
    }
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate inputs
    if (!productName || photos.length === 0 || !category || !price) {
      Alert.alert("Incomplete Information", "Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting Update for Product ID:", product.id);
      console.log("Current User:", currentUser);

      // Fetch the product to confirm existence and ownership
      const { data: existingProduct, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", product.id)
        .single();

      console.log("Fetched Product:", existingProduct);

      if (fetchError || !existingProduct) {
        throw new Error("Product not found.");
      }

      if (existingProduct.user_id !== currentUser?.id) {
        throw new Error("You are not authorized to update this product.");
      }

      // Update the product
      const { data, error } = await supabase
        .from("products")
        .update({
          product_name: productName,
          product_descrip: productDescription,
          product_img: photos[0],
          product_cond: condition,
          category,
          price: priceValue,
        })
        .eq("id", product.id)
        .select();

      if (error) throw new Error(`Update failed: ${error.message}`);

      console.log("Updated Product:", data);
      Alert.alert("Success", "Product updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating product:", error.message);
      Alert.alert("Error", error.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <ImageBackground
      source={require("../../assets/sell/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNavigation}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image source={require("../../assets/sell/back.png")} style={styles.navIcon} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Edit Product</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
            <Image
              source={require("../../assets/sell/check.png")}
              style={[styles.navIcon, { opacity: isSubmitting ? 0.5 : 1 }]}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Photos Section */}
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
                      source={require("../../assets/sell/remove_photo.png")}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 10 && (
                <TouchableOpacity style={styles.photoBox} onPress={handleAddPhoto}>
                  <Image
                    source={require("../../assets/sell/photo_add.png")}
                    style={styles.addPhotoIcon}
                  />
                  <Text style={styles.photoCountText}>
                    {`${photos.length}/10 Select a Photo of your Product.\nThe first photo is your main photo of your product.`}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Product Details Section */}
          <View style={styles.section}>
            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={productDescription}
              onChangeText={setProductDescription}
              multiline
            />
            <TextInput
              placeholder="Price"
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          {/* Condition Section */}
          <View style={styles.section}>
            <View style={styles.conditionContainer}>
              <View style={styles.conditionHeader}>
                <Image
                  source={require("../../assets/sell/condition.png")}
                  style={styles.conditionIcon}
                />
                <Text style={styles.conditionTitle}>Condition</Text>
              </View>
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
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity
              style={styles.categoryContainer}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={styles.categoryText}>{category || "Select Category"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Categories Modal */}
        <Modal
          visible={isCategoryModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Product Category</Text>
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

export default EditProduct;

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
        radioLabel: {
          marginLeft: 5,
        },
        categoryContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FFF",
          borderWidth: 3,
          borderColor: "#4E56A0",
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
        categoryText: {
          flex: 1,
          fontSize: 16,
          color: "#4E56A0",
        },
        categoryIcon: {
          width: 25,
          height: 25,
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
          width: "80%",
          backgroundColor: "#FFF",
          borderRadius: 10,
          padding: 20,
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
          marginBottom: 10,
        },
        modalItemText: {
          marginLeft: 10,
        },
});
