import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Handle Search Functionality
  const search = () => {
    if (searchQuery.trim() !== "") {
      navigation.navigate("SearchProd", { query: searchQuery.trim() });
    } else {
      alert("Please enter a search query!");
    }
  };
  console.log(search);
  // Example product items
  const productItems = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Product ${i + 1}`,
    price: `₱${(i + 1) * 100}`,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/background.jpg")}
          style={styles.background}
        >
          {/* Top Container with Search Bar */}
          <View style={styles.topContainer}>
            <View style={{ flex: 1, position: "relative" }}>
              <View style={styles.searchIconContainer}>
                <TouchableOpacity onPress={search}>
                  <Image
                    source={require("../../assets/home/search.png")}
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.searchBar}
                placeholder="Search Products..."
                placeholderTextColor="#000"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={search}
              />
            </View>
          </View>

          {/* Scrollable Product Sections */}
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Featured Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("../../assets/home/featured.png")}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Featured</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
              >
                {productItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productContainer}
                    onPress={() =>
                      navigation.navigate("ProductSelectedHome", {
                        product: item,
                      })
                    }
                  >
                    <Image
                      source={require("../../assets/home/product.png")}
                      style={styles.productImage}
                    />
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Recently Viewed Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require("../../assets/home/recent.png")}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Recently Viewed</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
              >
                {productItems.map((item) => (
                  <View key={item.id} style={styles.productContainer}>
                    <Image
                      source={require("../../assets/home/product.png")}
                      style={styles.productImage}
                    />
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.home_navCircle}>
          <Image
            source={require("../../assets/navigation/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Marketplace")}
        >
          <Image
            source={require("../../assets/navigation/marketplace.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCircle}
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            source={require("../../assets/navigation/profile.png")}
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
    paddingHorizontal: 35,
    paddingVertical: 10,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: "space-between",
    height: 115,
    width: "303"
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 50,
    position: "relative",
    zIndex: 1,
    
  },
  searchIconContainer: {
    position: "absolute",
    height: "100%", 
    backgroundColor: "#4E56A0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 2,
    width: 45,
    height: 45,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
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
  message_topIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
    resizeMode: "contain",
    borderRadius: 25,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 90, 
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
    width: 45, 
    height: 45,
    margin: 10,
    marginRight: 5,
    backgroundColor: "#201b51",
    borderRadius: 10, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#201B51",
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  productContainer: {
    backgroundColor: "#fff",
    marginLeft: 20,
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    width: 170,
  },
  productImage: {
    width: "100%",
    height: 190, 
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 12,
    color: "#4E56A0",
    marginBottom: 10,
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
