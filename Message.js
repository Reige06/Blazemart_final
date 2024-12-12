// Import necessary libraries
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { supabase } from "./supabase"; // Make sure to configure supabase.js properly
import { AuthProvider } from "./AuthProvider";

export default function Message({ route }) {
  const { productId, sellerId, sellerName } = route.params; // Passed from navigation
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();
  const userId = user ? user.id : null;

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
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  // Send a new message to Supabase
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

  // Listen for new messages in real-time
  const subscribeToMessages = () => {
    if (!userId) {
      console.error("User is not authenticated");
      return () => {};
    }

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          if (
            (newMessage.sender_id === userId && newMessage.receiver_id === sellerId) ||
            (newMessage.sender_id === sellerId && newMessage.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  // UseEffect hooks for fetching and subscribing
  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    fetchMessages();
    const unsubscribe = subscribeToMessages();
    return unsubscribe;
  }, [userId]);

  // Render individual message bubbles
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
    <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={styles.background}
        />
      <View style={styles.header}>
        <Text style={styles.headerText}>{sellerName}</Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4E56A0",
  },
  headerText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
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
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  sellerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FBB217",
  },
  messageText: { color: "#FFF" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
});



 