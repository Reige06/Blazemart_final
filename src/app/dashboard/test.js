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
import { supabase } from "../supabase";

export default function Message({ route, navigation }) {
  const { productId, sellerId, sellerName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState(null);

  // Fetch the current user
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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("product_name, price, product_img")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("product_id", productId) // Filter messages by the current product
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  // Send a new message
  const sendMessage = async () => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    if (input.trim()) {
      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: userId,
          receiver_id: sellerId,
          content: input,
          product_id: productId, // Ensure the message is tied to the product
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setMessages([...messages, ...data]);
        setInput("");
      }
    }
  };

  // Subscribe to new messages in real-time using supabase.channel
  useEffect(() => {
    if (!userId || !productId) return;

    const channel = supabase.channel(`product_${productId}`); // Create a unique channel for the product

    channel.on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const newMessage = payload.new;

      // Add the new message if it's related to the selected product
      if (newMessage.product_id === productId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Subscribe to the channel
    channel.subscribe();

    // Fetch initial messages when component mounts
    fetchMessages();

    // Clean up the subscription when the component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, [userId, productId]);

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender_id === userId ? styles.userMessage : styles.sellerMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
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
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.chatContainer}
          />
        )}

        {/* Input Box */}
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
}