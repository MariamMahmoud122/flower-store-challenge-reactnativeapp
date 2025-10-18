import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { MMKV } from "react-native-mmkv";
import { useNavigation } from "@react-navigation/native";

const storage = new MMKV();

export default function LogoutScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    storage.clearAll();

    // ✅ لو Login متسجلة في نفس الـ navigator
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });

    // ✅ أو استخدمي navigate لو reset بيعمل مشكلة
    // navigation.navigate("Login");
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8CA0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
