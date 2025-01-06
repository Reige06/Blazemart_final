import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MySavedPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [category, setCategory] = useState("All Items");

  const data = [
    {
      id: "1",
      image: "https://via.placeholder.com/100",
      title: "Acer Swift 3 Ryzen 5",
      price: "₱33,000",
      status: "Available",
    },
    {
      id: "2",
      image: "https://via.placeholder.com/100",
      title: "Scientific Calculator",
      price: "₱700",
      status: "Available",
    },
    {
      id: "3",
      image: "https://via.placeholder.com/100",
      title: "Foundation",
      price: "₱200",
      status: "Sold",
    },
    {
      id: "4",
      image: "https://via.placeholder.com/100",
      title: "iPhone 14 Pro (128GB)",
      price: "₱37,990",
      status: "Sold",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <Text
          style={[
            styles.cardStatus,
            { color: item.status === "Available" ? "#34a853" : "#ea4335" },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Image
          source={require("../../assets/message.png")}
          style={styles.messageIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("../../assets/background.jpg")}
          style={styles.background}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Saved Items</Text>
          </View>

          {/* Category Tabs */}
          <View style={styles.categoryTabs}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                category === "All Items" && styles.activeTabButton,
              ]}
              onPress={() => setCategory("All Items")}
            >
              <Ionicons name="heart" size={18} color="#fff" />
              <Text style={styles.tabButtonText}>All Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                category === "Collections" && styles.activeTabButton,
              ]}
              onPress={() => setCategory("Collections")}
            >
              <Ionicons name="folder" size={18} color="#fff" />
              <Text style={styles.tabButtonText}>Collections</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            {["All", "Available", "Sold"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterButton,
                  activeTab === tab && styles.activeFilterButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeTab === tab && styles.activeFilterButtonText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Items List */}
          <FlatList
            data={data.filter(
              (item) => activeTab === "All" || item.status === activeTab
            )}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

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
  header: {
    backgroundColor: "#4E56A0",
    height: 80,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    top: 40,
    right: 0,
    textAlign: "center",
  },
  categoryTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#4E56A0",
    paddingVertical: 10,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: "#356cb1",
  },
  tabButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: "#4a90e2",
  },
  filterButtonText: {
    color: "#333",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    color: "#333",
  },
  cardStatus: {
    marginTop: 5,
    fontWeight: "bold",
  },
  messageButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    right: 20,
  },
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
});

export default MySavedPage;
