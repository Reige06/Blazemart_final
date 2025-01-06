import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { supabase } from "../supabase"; // Import Supabase client

const Message = ({ navigation, route }) => {
  const { productId } = route.params; // Extract productId from navigation parameters
  const [messages, setMessages] = useState([]);
  const [seller, setSeller] = useState(null);
  const [product, setProduct] = useState(null); // Add product state
  const [userId, setUserId] = useState(null);
  const [input, setInput] = useState(""); // Input state for new messages
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching current user:", error);
      } else {
        setUserId(data.user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch seller's details and messages
  useEffect(() => {
    const fetchSellerAndMessages = async () => {
      try {
        setLoading(true);
  
        // Fetch the product and seller details
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select(`id, user_id, product_name, product_img, price, users: user_id (full_name)`)
          .eq("id", productId)
          .single();
  
        if (productError) {
          console.error("Error fetching product:", productError);
          throw productError;
        }
  
        setProduct(productData);
        setSeller(productData?.users?.full_name || "Unknown Seller");
  
        // Fetch the messages related to the product
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("id, sender_id, receiver_id, content, created_at")
          .eq("product_id", productId)
          .order("created_at", { ascending: true });
  
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          throw messagesError;
        }
  
        // Fetch the names of both the buyer and the seller
        const senderIds = messagesData.map(message => message.sender_id);
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, full_name")
          .in("id", senderIds);
  
        if (usersError) {
          console.error("Error fetching users:", usersError);
          throw usersError;
        }
  
        // Create a map of sender_id to user names
        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user.full_name;
          return acc;
        }, {});
  
        // Update the messages with the corresponding sender names
        const updatedMessages = messagesData.map((message) => ({
          ...message,
          sender_name: usersMap[message.sender_id], // Add sender_name to each message
        }));
  
        setMessages(updatedMessages);
        
      } catch (err) {
        console.error("Error fetching seller or messages:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (productId) fetchSellerAndMessages();
  }, [productId]);
  

  // Set up real-time subscription for new messages
  useEffect(() => {
    const messageChannel = supabase
      .channel(`messages:product_id=eq.${productId}`)
      .on("INSERT", (payload) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          payload.new,
        ]);
      })
      .subscribe();

    return () => {
      
      supabase.removeChannel(messageChannel);
    };
  }, [productId]);

  const sendMessage = async () => {
    if (!input.trim() || !product?.user_id || !userId) {
      return;
    }

    const newMessage = {
      sender_id: userId,
      receiver_id: product.user_id,
      content: input,
      product_id: productId,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      const { data, error } = await supabase.from("messages").insert([{
        sender_id: userId,
        receiver_id: product.user_id,
        content: input,
        product_id: productId,
      }]);

      if (error) {
        throw error;
      }

      setInput(""); 
    } catch (err) {
      console.error("Error sending message:", err);  
    }
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUserSender = item.sender_id === userId;
  
    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUserSender ? styles.userMessage : styles.sellerMessage,
        ]}
      >
        <Text>{isCurrentUserSender ? "You" : item.sender_name || "Unknown"}</Text>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };
  

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/messaging/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            {product?.product_img && (
              <Image
                source={{ uri: product.product_img }}
                style={styles.productImage}
              />
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product?.product_name}</Text>
              <Text style={styles.productPrice}>₱{product?.price}</Text>
              {seller && <Text style={styles.sellerName}>Seller: {seller}</Text>}
            </View>
          </View>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Message;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  backgroundImage: { flex: 1, resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(31, 29, 29, 0.5)", 
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E56A0",
    padding: 10,
    opacity: 0.9,
    marginTop: 40,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  productDetails: {},
  productName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    color: "#FFF",
    fontSize: 14,
  },
  chatContainer: { flexGrow: 1, padding: 10 },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4E56A0",
  },
  sellerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FBB217",
    
  },
  messageText: {
    color: "#FFF",
    fontWeight: "500",
    paddingTop: 5
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4E56A0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: { color: "#FFF", fontSize: 16 },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  sellerName: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5, 
    fontWeight: "bold"
  },
});
