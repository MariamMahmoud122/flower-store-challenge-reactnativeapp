import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import OfflineBanner from "../components/OfflineBanner";

type CategoryRouteProp = RouteProp<RootStackParamList, "SpecificCategory">;

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
}

export default function SpecificCategoryScreen() {
  const route = useRoute<CategoryRouteProp>();
  const { category } = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      Alert.alert("Error", "Failed to fetch category products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#FF8CA0", "#FF5252", "#6A1B9A"]} style={styles.container}>
      <OfflineBanner />
      <Text style={styles.header}>📦 {category.replace(/-/g, " ")}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCategoryProducts} />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
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
