import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppState, AppStateStatus } from "react-native";
import { setupQueryPersistence, queryClient } from "./src/queryClient";
import { LockProvider, useLock } from "./src/contexts/LockContext";

import LoginScreen from "./src/screens/LoginScreen";
import AllProductsScreen from "./src/screens/AllProductsScreen";
import SpecificCategoryScreen from "./src/screens/SpecificCategoryScreen";
import LockScreen from "./src/screens/LockScreen";
import OfflineBanner from "./src/components/OfflineBanner";

export type RootStackParamList = {
  Login: undefined;
  AllProducts: undefined;
  SpecificCategory: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { locked, setLocked } = useLock();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // قفل التطبيق بعد 10 ثواني من عدم التفاعل
  const startInactivityTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLocked(true);
    }, 10000); // 10 ثواني
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/active/) && nextState === "background") {
        setLocked(true);
      } else if (nextState === "active") {
        startInactivityTimer();
      }
      appState.current = nextState;
    });

    // نبدأ التايمر أول ما التطبيق يفتح
    startInactivityTimer();

    return () => {
      subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (locked) return <LockScreen />;

  return (
    <>
      <OfflineBanner />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f0ff" },
          headerTintColor: "#6A1B9A",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AllProducts" component={AllProductsScreen} />
        <Stack.Screen name="SpecificCategory" component={SpecificCategoryScreen} />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await setupQueryPersistence();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <LockProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LockProvider>
    </QueryClientProvider>
  );
}
