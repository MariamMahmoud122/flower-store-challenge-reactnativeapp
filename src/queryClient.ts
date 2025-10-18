// src/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const mmkvAsyncStorage = {
  getItem: async (key: string) => storage.getString(key) ?? null,
  setItem: async (key: string, value: string) => storage.set(key, value),
  removeItem: async (key: string) => storage.delete(key),
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      gcTime: 1000 * 60 * 60 * 24, // يوم كامل
      refetchOnReconnect: true,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: mmkvAsyncStorage as any,
});

export async function setupQueryPersistence() {
  await persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // يوم كامل
  });
}
