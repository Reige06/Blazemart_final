import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../supabase"; // Ensure to import supabase

const MessagePage = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Function to determine buyer and seller roles
  const determineBuyerSeller = (message, userId) => {
    if (message.receiver_id === userId) {
      return {
        buyerName: message.sender?.full_name || "Unknown Buyer",
        sellerName: message.receiver?.full_name || "You",
      };
    } else {
      return {
        buyerName: message.receiver?.full_name || "You",
        sellerName: message.sender?.full_name || "Unknown Seller",
      };
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserId(data?.user?.id || null);
      }
    };

    fetchUser();
  }, []);

  // Fetch conversations (grouped by product) from Supabase
  const fetchChats = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        created_at,
        sender:sender_id(full_name),
        receiver:receiver_id(full_name),
        product_id,
        products(id, product_name, product_img, price)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch chats. Please try again later.",
      });
      setChats([]);
    } else {
      console.log("Fetched chats:", data);

      // Group messages by product
      const groupedChats = data.reduce((acc, message) => {
        const productId = message.products?.id;
        if (!acc[productId]) {
          acc[productId] = {
            productId,
            productName: message.products?.product_name,
            productImg: message.products?.product_img,
            productPrice: message.products?.price,
            messages: [],
          };
        }

        // Determine buyer and seller based on message initiator
        const { buyerName, sellerName } = determineBuyerSeller(message, userId);

        acc[productId].messages.push({
          ...message,
          buyerName,
          sellerName,
        });

        return acc;
      }, {});

      setChats(Object.values(groupedChats));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchChats();
  }, [userId]);

  const handleChatPress = (chat) => {
    const firstMessage = chat.messages[0];

    const sellerId =
      firstMessage.receiver_id === userId
        ? firstMessage.receiver_id
        : firstMessage.sender_id;

    const sellerName =
      firstMessage.receiver_id === userId
        ? firstMessage.receiver?.full_name || "You"
        : firstMessage.sender?.full_name || "Unknown Seller";

    navigation.navigate("Message", {
      productId: chat.productId,
      sellerId, 
      sellerName, 
      productName: chat.productName,
      productImg: chat.productImg,
      productPrice: chat.productPrice,
    });

    console.log("Chat item:", chat);
    console.log("First message:", firstMessage);
  };

  const renderChatItem = ({ item }) => {
    const firstMessage = item.messages[0]; 
    const buyerName = firstMessage?.buyerName || "Unknown Buyer"; 
    const sellerName = firstMessage?.sellerName || "Unknown Seller"; 
    const lastMessageContent = firstMessage?.content || "No messages yet";

    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => handleChatPress(item)}
      >
        <Image
          source={
            item.productImg
              ? { uri: item.productImg }
              : require("../../assets/messaging/product.jpg")
          }
          style={styles.chatImage}
        />
        <View style={styles.chatDetails}>
          
          <Text style={styles.chatTitle}>{buyerName}</Text>
          <Text style={styles.chatMessage}>{lastMessageContent}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/messaging/background.jpg")}
        style={styles.backgroundImage}
      />
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/search_category/back.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Messages</Text> 
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading chats...</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) =>
            item.productId ? item.productId.toString() : (item.id ? item.id.toString() : Math.random().toString())
          }
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatList}
        />
      )}

      <Toast />
    </View>
  );
};

export default MessagePage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: "cover",
    zIndex: -1,
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
  chatList: {
    padding: 10,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  chatMessage: {
    fontSize: 12,
    color: "#666",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
