// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  username: string;
  role?: string;
}

const initialState: AuthState = {
  token: "",
  username: "",
  role: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; username: string; role?: string }>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = "";
      state.username = "";
      state.role = undefined;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
