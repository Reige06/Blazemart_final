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
import { supabase } from "./supabase"; // Import your supabase client setup

const { width } = Dimensions.get("window");

const Divider = () => <View style={styles.divider} />;

export default function ProductSelectedHome({ route }) {
  const navigation = useNavigation();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const productId = route.params.productId; // Assuming productId is passed in route params

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
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {sections.map(renderSection)}
          </ScrollView>
        </ImageBackground>
      </View>

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
          source={require("./assets/home/message.png")}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Chat Now</Text>
      </TouchableOpacity>
        
      </View>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.home_navCircle}>
          <Image
            source={require("./assets/navigation/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Marketplace")}
        >
          <Image
            source={require("./assets/navigation/marketplace.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Notification")}
        >
          <Image
            source={require("./assets/navigation/notifications.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("ProfilePage")}
        >
          <Image
            source={require("./assets/navigation/profile.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 35,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 50, // Add padding to the left for the icon
    position: "relative",
    zIndex: 1, // Ensure the search bar is below the icon
  },
  searchIconContainer: {
    position: "absolute",
    height: "100%",
    width: 45, // Adjust width as needed
    backgroundColor: "#4E56A0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 2, // Ensure the icon is above the search bar
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  topIcons: {
    flexDirection: "row",
  },
  topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    resizeMode: "contain",
    backgroundColor: "#4E56A0",
    borderRadius: 30,
  },
  scrollViewContent: {
    paddingBottom: 90, // To avoid overlap with bottom navigation
  },
  product_title_price_container: {
    marginTop: 150, // Adjust to position below the image container
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
    marginBottom: -150, // Adjust to overlap the white box
    zIndex: 1,
  },
  productImage: {
    width: width, // Ensure the image takes the full width of the screen
    height: "100%",
    resizeMode: "cover",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#4E56A0",
    paddingVertical: 5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
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
  sectionSubtitle: {
    fontSize: 16,
    color: "#4E56A0",
    marginBottom: 10,
  },
  divider: {
    height: 1.5,
    backgroundColor: "#4E56A0",
    marginVertical: 5,
  },

  //Seller Area
  sellerInfoBox: {
    backgroundColor: "#5775A4",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sellerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sellerContact: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  messageIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  sendMessageText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  blankContainer: {
    height: 20, // Adjust height as needed
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderColor: "#4E56A0",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#FBB217",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  //End Seller Area

  relatedProductImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  
  buttonContainer: {
    position: "absolute",
    bottom: 95,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 0,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 0,
    marginHorizontal: 0,
  },
  chatNowButton: {
    backgroundColor: "#FBB217",
  },
  saveButton: {
    backgroundColor: "#4E56A0",
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomNavigation: {
    height: 95,
    backgroundColor: "#7190BF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  home_navCircle: {
    width: 65,
    height: 65,
    backgroundColor: "#4E56A0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  
  notificationContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#4E56A0",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  notificationHeading: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  notificationDescription: {
    color: "white",
    fontSize: 16,
    textAlign: "justified",
  },
});




      
      