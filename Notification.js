import React from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Notification() {
  const navigation = useNavigation();

  const notifications = [
    { id: "1", text: "Your order has been shipped." },
    { id: "2", text: "Your item has been delivered." },
    { id: "3", text: "New message from seller." },
    // Add more notifications as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>{item.text}</Text>
    </View>
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
                placeholder="Search Notifications..."
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

          {/* Notification Title Row */}
          <View style={styles.titleRow}>
            <View style={styles.cartAndTitle}>
              <View style={styles.cartContainer}>
                <Image
                  source={require("./assets/marketplace/cart.png")}
                  style={styles.cartIcon}
                />
              </View>
              <Text style={styles.title}>Notifications</Text>
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

          {/* Notification List */}
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationList}
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
            <TouchableOpacity
              style={styles.navCircle}
              onPress={() => navigation.navigate("Marketplace")}
            >
              <Image
                source={require("./assets/navigation/marketplace.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.marketplace_navCircle}>
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
  notificationList: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  notificationContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "bold",
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
});
