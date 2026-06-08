import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set auth header for all requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/users/login", { email, password });
      setAuthToken(data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/users/register", { name, email, password, role });
      setAuthToken(data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// Get current user
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/users/me");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.data = null;
      localStorage.removeItem("user");
      setAuthToken(null);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      // Fetch user
      .addCase(fetchUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUser.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(fetchUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
