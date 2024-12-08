import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Marketplace() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Sell");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
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
  ];

  const productItems = Array.from({ length: 30 }, (_, i) => ({
    id: i.toString(),
    title: `Product ${i + 1}`,
    price: `₱${(i + 1) * 100}`,
    image: require("./assets/marketplace/sample_product.jpg"), // Replace with actual images
  }));

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "Sell") {
      navigation.navigate("SellProduct");
    } else if (tab === "Categories") {
      setCategoryModalVisible(true);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
    navigation.navigate("CategoryPage", { category });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productContainer}>
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
          <View style={styles.topContainer}>
            <View style={{ flex: 1, position: "relative" }}>
              <View style={styles.searchIconContainer}>
                <Image
                  source={require("./assets/home/search.png")}
                  style={styles.searchIcon}
                />
              </View>
              <TextInput
                style={styles.searchBar}
                placeholder="Search Products..."
                placeholderTextColor="#000"
              />
            </View>
            <View style={styles.topIcons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MySavedPage")}
              >
                <Image
                  source={require("./assets/marketplace/heart.png")}
                  style={styles.topIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("MessagePage")}
              >
                <Image
                  source={require("./assets/marketplace/message.png")}
                  style={styles.topIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Marketplace Title Row */}
          <View style={styles.titleRow}>
            <View style={styles.cartAndTitle}>
              <View style={styles.cartContainer}>
                <Image
                  source={require("./assets/marketplace/cart.png")}
                  style={styles.cartIcon}
                />
              </View>
              <Text style={styles.title}>Marketplace</Text>
            </View>
            <TouchableOpacity>
              <View style={styles.profileContainer}>
                <Image
                  source={require("./assets/marketplace/profile_icon.png")}
                  style={styles.profileIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {["Sell", "Categories"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Product List */}
          <FlatList
            data={productItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            <TouchableOpacity
              style={styles.navCircle}
              onPress={() => navigation.navigate("Home")}
            >
              <Image
                source={require("./assets/navigation/home.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.marketplace_navCircle}>
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
        </ImageBackground>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Product Category</Text>
            <ScrollView>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.radioItem}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.radioLabel}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF0FF",
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
    paddingHorizontal: 35,
    top: 40,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF", // Ensure the search bar has a white background
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
    alignItems: "center",
  },
  topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    borderRadius: 30,
    backgroundColor: "#4E56A0",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 10,
    top: 40,
  },
  cartAndTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4E56A0",
    marginLeft: 10,
  },
  profileIcon: {
    width: 28,
    height: 28,
    borderRadius: 25,
  },
  cartContainer: {
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    padding: 5,
  },
  profileContainer: {
    backgroundColor: "#4E56A0",
    borderRadius: 40,
    padding: 11,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  cartIcon: {
    width: 40,
    height: 40,
  },
  tabs: {
    flexDirection: "row",
    top: 25,
    left: 25,
    marginVertical: 20,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginHorizontal: 5, // Add margin between buttons
    marginBottom: 20, // Add margin below buttons
  },
  activeTabButton: {
    backgroundColor: "#4E56A0",
  },
  tabText: {
    fontSize: 14,
    color: "#4E56A0",
    fontWeight: "800",
  },
  activeTabText: {
    color: "#FFF",
  },
  productList: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: "#4E56A0",
  },
  bottomNavigation: {
    height: 90,
    backgroundColor: "#7190BF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  marketplace_navCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#4E56A0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
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
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});
