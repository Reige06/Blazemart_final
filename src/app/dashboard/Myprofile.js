import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";

const { width } = Dimensions.get("window");

export default function MyProfile() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw new Error(sessionError.message);

        const currentUser = session?.user;
        if (currentUser) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("full_name, email, profile_img, bio")
            .eq("id", currentUser.id)
            .single();

          if (userError) throw new Error(userError.message);

          const { data: userProducts, error: productsError } = await supabase
            .from("products")
            .select("*")
            .eq("user_id", currentUser.id);

          if (productsError) {
            console.error("Error fetching products:", productsError.message);
          } else {
            setListings(userProducts);
          }

          setUser(userData);
        } else {
          throw new Error("User not logged in");
        }
      } catch (error) {
        console.error("Error fetching user data or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate("Editprod", { product: selectedProduct });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Do you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setModalVisible(true),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", selectedProduct.id);

              if (error) throw error;

              setListings(listings.filter((item) => item.id !== selectedProduct.id));
              setModalVisible(false);
              Alert.alert("Success", "Product deleted successfully.");
            } catch (error) {
              console.error("Error deleting product:", error.message);
              Alert.alert("Error", "Failed to delete the product.");
            }
          },
        },
      ]
    );
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.backgroundContainer}>
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
              <Text style={styles.navTitle}>My Profile</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <ImageBackground
                source={require("../../assets/profile/profile_cover.jpg")}
                style={styles.profileBox}
              >
                <Image
                  source={
                    user?.profile_img
                      ? { uri: user.profile_img }
                      : require("../../assets/profile_icon.png")
                  }
                  style={styles.profileImage}
                />
              </ImageBackground>
              <Text style={styles.profileName}>{user?.full_name}</Text>
              <Text style={styles.profileBio}>{user?.bio || "No bio provided"}</Text>

              {/* Edit Profile Button */}
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => navigation.navigate("Edit")}
              >
                <Image
                  source={require("../../assets/edit.png")}
                  style={styles.editIcon}
                />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            {/* User info */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("../../assets/bio_icon.png")}
                  style={styles.sectionIcon2}
                />
                <Text style={styles.sectionTitle}>User Info</Text>
              </View>
              <View style={styles.bioContainer}>
                <View style={styles.bioItem}>
                  <Image
                    source={require("../../assets/verified.png")}
                    style={styles.bioIcon}
                  />
                  <Text style={styles.bioText}>Verified Trailblazer</Text>
                </View>
                <View style={styles.bioItem}>
                  <Image
                    source={require("../../assets/email.png")}
                    style={styles.bioIcon}
                  />
                  <Text style={styles.bioText}>{user?.email}</Text>
                </View>
              </View>
            </View>

            {/* Listings Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("../../assets/listing.png")}
                  style={styles.sectionIcon2}
                />
                <Text style={styles.sectionTitle}>Listings</Text>
              </View>
              {listings.length > 0 ? (
                <View style={styles.listingsGrid}>
                  {listings.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.productCard}
                      onPress={() => handleProductClick(item)}
                    >
                      <Image
                        source={
                          item.product_img
                            ? { uri: item.product_img }
                            : require("../../assets/marketplace/sample_product.jpg")
                        }
                        style={styles.productImage}
                      />
                      <Text style={styles.productName}>
                        {item.product_name || "Unknown Product"}
                      </Text>
                      <Text style={styles.productPrice}>₱{item.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noListingsText}>
                  You haven't listed any products yet.
                </Text>
              )}
            </View>

            {/* Product Modal */}
            {selectedProduct && (
              <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>x</Text>
                    </TouchableOpacity>
                    
                    {/* Product Image */}
                    <Image
                      source={
                        selectedProduct.product_img
                          ? { uri: selectedProduct.product_img }
                          : require("../../assets/marketplace/sample_product.jpg")
                      }
                      style={styles.modalProductImage}
                    />

                    {/* Product Name */}
                    <Text style={styles.modalProductName}>{selectedProduct.product_name}</Text>

                    {/* Modal Buttons */}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.editButton]}
                        onPress={handleEdit}
                      >
                        <Text style={styles.modalButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.deleteButton]}
                        onPress={handleDelete}
                      >
                        <Text style={styles.modalButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
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
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 180,
    height: 180,
    position: "absolute",
    borderColor: "#CDC684",
    borderWidth: 4,
    borderRadius: 100,
    top: 50,
    zIndex: 1,
    
  },
  profileBox: {
    width: "100%",
    height: 180,
    backgroundColor: "#4E56A0",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4e56a0",
    marginTop: 55,
    paddingHorizontal: 63,
    alignSelf: "center",
  },
  profileDescription: {
    fontSize: 15,
    alignSelf: "center",
    paddingHorizontal: 83,
    fontWeight: "bold",
    color: "#4e56a0",
  },
  bioContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 45,
    marginVertical: 15,
  },
  bioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bioIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  sectionContainer: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
  },
  sectionIcon2: {
    width: 60,
    height: 60,
    margin: 10,
    marginRight: 5,
    backgroundColor: "#201b51",
    borderRadius: 40,
    borderColor: "#CDC684",
    borderWidth: 4,
    right: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#201B51",
  },
  bioText: {
    fontSize: 16,
    color: "#4E56A0",
  },
  listingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  productCard: {
    width: "49%",
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 250,
  },
  productImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E56A0",
    padding: 5,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#4E56A0",
    paddingBottom: 10,
    paddingLeft: 5,
    textAlign: "center",
  },
  noListingsText:{
    textAlign: 'center',
    fontSize: 20
  },
  profileBio: {
    fontSize: 15,
    alignSelf: "center",
    paddingHorizontal: 20,
    color: "#4e56a0",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#4E56A0",
    padding: 10,
    borderRadius: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  editText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  modalProductImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4E56A0",
    marginBottom: 50,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#4E56A0",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

