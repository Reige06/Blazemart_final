import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase"; 

const { width } = Dimensions.get("window");

const Divider = () => <View style={styles.divider} />;

export default function ProductSelectedHome({ route }) {
  const navigation = useNavigation();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const productId = route.params.productId; 

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (!error) {
        setCurrentUser(user);
      } else {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch product and seller data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!productId) {
          console.log("Product ID is missing");
          return;
        }

        // Fetch product details
        const { data: productData, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) throw error;

        setProduct(productData);

        // Fetch seller details
        const { data: sellerData, error: sellerError } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", productData.user_id)
          .single();

        if (sellerError) throw sellerError;

        setSeller(sellerData);
      } catch (err) {
        console.error("Error fetching product or seller:", err);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const isCurrentUserSeller = currentUser?.user?.id === product?.user_id;

  const sections = [
    { type: "images" },
    { type: "details" },
    { type: "seller" },
  ];

  const renderSection = (section) => {
    switch (section.type) {
      case "images":
        return (
          <View style={styles.imageContainer} key="images">
            <Image
              source={{ uri: product?.product_img }}
              style={styles.productImage}
            />
          </View>
        );
      case "details":
        return (
          <View key="details">
            <View style={styles.product_title_price_container}>
              <Text style={styles.productTitle}>{product?.product_name}</Text>
              <Text style={styles.productPrice}>₱{product?.price}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Details</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.productDescription}>
                {product?.product_descrip}
              </Text>
            </View>
            <Divider />
          </View>
        );
      case "seller":
        return (
          <View key="seller">
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Seller Information</Text>
            </View>
            <View style={styles.sellerInfoBox}>
              <Text style={styles.sellerName}>{seller?.full_name}</Text>
            </View>
            <Divider />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back Arrow */}
      <View style={styles.topNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/background.jpg")}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {sections.map(renderSection)}
          </ScrollView>
        </ImageBackground>
      </View>

      {/* Buttons at the Bottom */}
      <View style={styles.bottomNavigation}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.chatNowButton]}
            disabled={isCurrentUserSeller}
            onPress={() =>
              navigation.navigate("Message", {
                productId: product?.id,
                sellerId: product?.user_id,
                sellerName: seller?.full_name,
              })
            }
          >
            <Image
              source={require("../../assets/home/message.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Chat Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={() =>
              navigation.navigate("SellerProfile", { userId: product?.user_id })
            }
          >
            <Image
              source={require("../../assets/profile_icon.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7190BF",
  },
  backgroundContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
    
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    
  },
  
  searchIcon: {
    width: 20,
    height: 20,
  },
 
  scrollViewContent: {
    paddingBottom: 90, 
    
  },
  product_title_price_container: {
    marginTop: 150, 
    marginHorizontal: 0,
    backgroundColor: "#4E56A0",
    padding: 10,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 0,
    marginBottom: -150, 
    zIndex: 1,
  },
  productImage: {
    width: width, 
    height: "100%",
    resizeMode: "cover",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
    alignSelf: "flex-start",
    top: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "bold",
    left: 10,
    color: "#FFFFFF",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    color: "#4E56A0",
    textAlign: "left",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 20,
    top: 10,
    fontWeight: "bold",
    color: "#4E56A0",
  },
  divider: {
    height: 1.5,
    backgroundColor: "#4E56A0",
    marginVertical: 5,
  },

  sellerInfoBox: {
    backgroundColor: "#5775A4",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
 
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  
  bottomNavigation: {
    height: 95,
    backgroundColor: "#7190BF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "45%",
  },
  chatNowButton: {
    backgroundColor: "#FBB217",
  },
  saveButton: {
    backgroundColor: "#4E56A0",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E56A0",
    paddingTop: 80,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: "relative",
    justifyContent: "center",
  },
});   