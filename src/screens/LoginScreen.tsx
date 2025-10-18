// LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MMKV } from "react-native-mmkv";
import { RootStackParamList } from "../types/navigation";

const storage = new MMKV();
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Error", "Please enter username and password");
    return;
  }

  try {
    setLoading(true);

    // تسجيل دخول محلي كمشرف باستخدام admin123
    if (username.trim().toLowerCase() === "admin" && password === "admin123") {
      storage.set("accessToken", "fake-admin-token");
      storage.set("username", "admin");
      storage.set("role", "superadmin");
      navigation.replace("AllProducts");
      return;
    }

    // تسجيل دخول من DummyJSON
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    storage.set("accessToken", String(data.token));
    storage.set("username", String(data.username));

    // تعيين الدور حسب اسم المستخدم
    if (username.trim().toLowerCase() === "admin") {
      storage.set("role", "superadmin");
    } else {
      storage.set("role", "user");
    }

    navigation.replace("AllProducts");
  } catch (err) {
    console.log("Login error:", err);
    Alert.alert("Login Failed", "Invalid username or password");
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#FF8CA0", "#FF5252", "#6A1B9A"]} style={styles.gradient}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: "center", paddingHorizontal: 25 },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 30, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  button: {
    backgroundColor: "#FF8CA0",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
