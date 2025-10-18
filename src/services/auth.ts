import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

interface LoginResponse {
  id: number;
  username: string;
  token: string;
}

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid username or password");
  return res.json();
};

export const saveToken = (token: string, username: string) => {
  storage.set("accessToken", token);
  storage.set("userName", username);
};

export const clearToken = () => {
  storage.delete("accessToken");
  storage.delete("userName");
};

export const getTokenAndUser = (): { token: string | null; username: string | null } => {
  const token = storage.getString("accessToken") ?? null;
  const username = storage.getString("userName") ?? null;
  return { token, username };
};
