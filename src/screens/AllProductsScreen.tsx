import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MMKV } from "react-native-mmkv";
import OfflineBanner from "../components/OfflineBanner";
import { RootStackParamList } from "../../App";

const storage = new MMKV();

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const categories = [ "", "smartphones", "laptops", "fragrances", "beauty", "groceries", "home-decoration", "furniture", "tops", "womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes", "mens-watches", "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "automotive", "motorcycle", "lighting" ];

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail?: string;
  isDeleted?: boolean;
}

export default function AllProductsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [role, setRole] = useState<string>("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const init = async () => {
      setRole(storage.getString("role") ?? "");
      await fetchProducts("");
    };
    init();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const token = storage.getString("accessToken");
        return (
          <Text
            style={{
              color: "#6A1B9A",
              fontSize: 16,
              marginRight: 10,
              fontWeight: "bold",
            }}
            onPress={() => {
              if (token) {
                storage.clearAll();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              } else {
                navigation.navigate("Login");
              }
            }}
          >
            {token ? "Logout" : "Login"}
          </Text>
        );
      },
    });
  }, []);

  const fetchProducts = async (category: string) => {
    try {
      const token = storage.getString("accessToken") ?? "";
      const url =
        category === ""
          ? "https://dummyjson.com/products"
          : `https://dummyjson.com/products/category/${category}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProducts(data.products ?? []);
      setSelectedCategory(category);
    } catch {
      Alert.alert("Error", "Failed to fetch products");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isDeleted: true } : p))
          );
        },
      },
    ]);
  };

    const filteredProducts = products
    .filter((p) => !p.isDeleted)
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {role === "superadmin" && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#FF8CA0", "#FF5252", "#6A1B9A"]} style={styles.container}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ All Products</Text>
      </View>

      <TextInput
        placeholder="Search products"
        style={styles.search}
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => scrollRef.current?.scrollTo({ x: 0, animated: true })}
        >
          <View style={styles.arrowLeft} />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat || "all"}
              onPress={() => fetchProducts(selectedCategory === cat ? "" : cat)}
            >
              <Text style={[styles.tab, selectedCategory === cat && styles.activeTab]}>
                {cat === "" ? "All" : cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.arrow}
          onPress={() => scrollRef.current?.scrollTo({ x: 200, animated: true })}
        >
          <View style={styles.arrowRight} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  search: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  tabs: {
    flexGrow: 0,
  },
  tab: {
    backgroundColor: "#FCEAF0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#FF8CA0",
    borderWidth: 1,
  },
  arrow: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  arrowRight: {
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  arrowLeft: {
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    padding: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8CA0",
  },
});
