import React, { useEffect, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../supabase";

export default function SearchProd() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState(route.params.query); // Initialize search query with passed value
  const [productItems, setProductItems] = useState([]);

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, product_name, product_img, price")
          .ilike("product_name", `%${searchQuery}%`);
        
        if (error) {
          console.error("Error fetching products:", error.message);
          return;
        }

        const productsWithPublicURLs = data.map((product) => ({
          ...product,
          product_img: product.product_img || "https://via.placeholder.com/150",
        }));

        setProductItems(productsWithPublicURLs);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() =>
        navigation.navigate("ProductSelectedHome", {
          productId: item.id,
        })
      }
    >
      <Image
        source={{ uri: item.product_img }}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{item.product_name}</Text>
      <Text style={styles.productPrice}>₱{item.price}</Text>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    // This can be enhanced further if needed
    setSearchQuery(searchQuery);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/background.jpg")}
          style={styles.background}
        >
          {/* Top Container with Search Bar */}
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../../assets/back.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Products..."
              placeholderTextColor="#000"
              value={searchQuery}
              onChangeText={setSearchQuery} // Allow search query updates
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Product List */}
          <FlatList
            data={productItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 50,
    justifyContent: "space-between",
    height: 115,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#4E56A0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  productList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    textAlign: "center",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: 190,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: "contain",
  },
  productTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: "#4E56A0",
  },
});
