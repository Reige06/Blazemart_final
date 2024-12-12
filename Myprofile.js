import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function MyProfile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const productItems = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    title: `Product ${i + 1}`,
    price: `₱${(i + 1) * 100}`,
    image: require("./assets/home/product.png"), // Replace with actual images
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() =>
        navigation.navigate("ProductSelectedHome", {
          product: item,
        })
      }
    >
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={styles.background}
        >
          {/* Top Navigation */}
          <View style={styles.topNavigation}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("./assets/search_category/back.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <Text style={styles.navTitle}>My Profile</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <ImageBackground
              source={require("./assets/profile/profile_cover.jpg")}
              style={styles.profileBox}
            >
              <Image
                source={require("./assets/profile_icon.png")}
                style={styles.profileImage}
              />
            </ImageBackground>
            <Text style={styles.profileName}>First Name{"\n"}Last Name</Text>
            <Text style={styles.profileDescription}>Trailblazer</Text>
          </View>

          {/* Sections */}
          <View style={styles.scrollViewContent}>
            {/* Bio Section */}
            <View style={styles.bioContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("./assets/profile_icon.png")}
                  style={styles.sectionIcon2}
                />
                <Text style={styles.sectionTitle}>Bio</Text>
              </View>
              <View style={styles.bioItem}>
                <Image
                  source={require("./assets/verified.png")}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioText}>Verified Trailblazer</Text>
              </View>
              <View style={styles.bioItem}>
                <Image
                  source={require("./assets/phone.png")}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioText}>09123456789</Text>
              </View>
              <View style={styles.bioItem}>
                <Image
                  source={require("./assets/email.png")}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioText}>example123@domain.com</Text>
              </View>
            </View>

            {/* My Listings Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("./assets/listing.png")}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>My Listings</Text>
              </View>
              <FlatList
                data={productItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
              />
              <View style={styles.divider} />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Navigation */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7190BF", // Bottom portion color
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
    justifyContent: 'center'
  },
  navIcon: {
    width: 30,
    height: 30,
    marginRight: 300
  },
  navTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    textAlign: 'center',
    // left: 150,
    // right: 150,
    transform: [{ translateY: 20 }],
    width: 100
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 0,
  },
  profileImage: {
    width: 180,
    height: 180,
    position: "absolute",
    borderColor: "#CDC684",
    borderWidth: 4,
    borderRadius: 100,
    top: 50,
    left: 40,
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
    alignSelf: "flex-start",
  },
  profileDescription: {
    fontSize: 15,
    alignSelf: "flex-start",
    paddingHorizontal: 83,
    fontWeight: "bold",
    color: "#4e56a0",
  },
  scrollViewContent: {
    paddingBottom: 90, // To avoid overlap with bottom navigation
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
  sectionIcon: {
    width: 60, // Increased width to accommodate padding
    height: 60, // Increased height to accommodate padding
    margin: 10,
    marginRight: 20,
    left: 10,
    backgroundColor: "#201b51",
    borderRadius: 40, // Adjusted border radius for a perfect circle
    borderColor: "#CDC684",
    borderWidth: 4,
  },
  sectionIcon2: {
    width: 60, // Increased width to accommodate padding
    height: 60, // Increased height to accommodate padding
    margin: 10,
    marginRight: 5,
    backgroundColor: "#201b51",
    borderRadius: 40, // Adjusted border radius for a perfect circle
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
  divider: {
    height: 3,
    backgroundColor: "#4E56A0",
    marginVertical: 10,
    marginHorizontal: 25,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: (width - 40) / 2, // Adjust width to be half of the screen width minus margins
    height: (width - 40) / 2, // Make the height equal to the width for a square container
  },
  productImage: {
    width: "100%",
    height: "70%", // Adjust height to fit within the container
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E56A0",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: "#4E56A0",
  },
  productList: {
    justifyContent: "center",
    alignItems: "center",
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
});
