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

// Helper: handle successful auth response
const handleAuthSuccess = (data) => {
  setAuthToken(data.token);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Helper: extract error message
const getError = (err, fallback) =>
  err.response?.data?.message || fallback;

/* ══════════════════════════════════════════════════════════════════════
   CUSTOMER THUNKS
══════════════════════════════════════════════════════════════════════ */
export const customerLogin = createAsyncThunk(
  "user/customerLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/customer/login", { email, password });
      return handleAuthSuccess(data.data);
    } catch (err) {
      return rejectWithValue(getError(err, "Login failed"));
    }
  }
);

export const customerRegister = createAsyncThunk(
  "user/customerRegister",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/customer/register", { name, email, password });
      return handleAuthSuccess(data.data);
    } catch (err) {
      return rejectWithValue(getError(err, "Registration failed"));
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   DESIGNER THUNKS
══════════════════════════════════════════════════════════════════════ */
export const designerLogin = createAsyncThunk(
  "user/designerLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/designer/login", { email, password });
      return handleAuthSuccess(data.data);
    } catch (err) {
      return rejectWithValue(getError(err, "Login failed"));
    }
  }
);

export const designerRegister = createAsyncThunk(
  "user/designerRegister",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/designer/register", { name, email, password });
      return handleAuthSuccess(data.data);
    } catch (err) {
      return rejectWithValue(getError(err, "Registration failed"));
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   ADMIN THUNKS  (login only — no public registration)
══════════════════════════════════════════════════════════════════════ */
export const adminLogin = createAsyncThunk(
  "user/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/admin/login", { email, password });
      return handleAuthSuccess(data.data);
    } catch (err) {
      return rejectWithValue(getError(err, "Login failed"));
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   GENERIC (legacy — kept for backward compat)
══════════════════════════════════════════════════════════════════════ */
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/users/me");
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err, "Failed to fetch user"));
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════════════════════════════ */

// All login/register thunk action types
const authThunks = [
  customerLogin, customerRegister,
  designerLogin, designerRegister,
  adminLogin,
];

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
    authThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(thunk.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
        .addCase(thunk.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
    });

    // fetchUser
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUser.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(fetchUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
