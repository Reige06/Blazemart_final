import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const CategoryPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;

  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNavigation}>
          <TouchableOpacity onPress={() => navigation.navigate("Marketplace")}>
            <Image
              source={require("./assets/search_category/back.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Marketplace</Text>
        </View>

        {/* Category Title */}
        <View style={styles.categoryContainer}>
          <Image
            source={require("./assets/search_category/category.png")}
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryTitle}>
            {`Search Result by\nCategory "${category}"`}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E56A0",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: "relative",
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    left: 150,
    right: 140,
    transform: [{ translateY: 20 }],
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 40,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },
});
