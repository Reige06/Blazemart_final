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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../supabase";

const { width } = Dimensions.get("window");

export default function SellerProfile() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the userId from route params passed when navigating from ProductSelectedHome
        const { userId } = route.params;
  
        // Fetch the seller's profile data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("full_name, email, profile_img, bio")
          .eq("id", userId) // Use the passed userId, not currentUser.id
          .single();
  
        if (userError) throw new Error(userError.message);
  
        // Fetch the seller's product listings
        const { data: userProducts, error: productsError } = await supabase
          .from("products")
          .select("id, product_name, product_img, price")
          .eq("user_id", userId); // Use userId for the seller's products
  
        if (productsError) {
          console.error("Error fetching products:", productsError.message);
        } else {
          setListings(userProducts);
        }
  
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data or products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); // No need for `currentUser` here since we're using `userId` from route params

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
                      onPress={() => navigation.navigate("ProductSelectedHome", { productId: item.id })}
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
  listingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productCard: {
    width: "48%",
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
  noListingsText: {
    textAlign: "center",
    fontSize: 20,
  },
  profileBio: {
    fontSize: 15,
    alignSelf: "center",
    paddingHorizontal: 20,
    color: "#4e56a0",
  },
});
