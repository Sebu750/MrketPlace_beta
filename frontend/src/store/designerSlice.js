import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchDashboardKPIs = createAsyncThunk(
  "designer/fetchDashboardKPIs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/designer/dashboard");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard");
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  "designer/fetchAnalytics",
  async ({ period = "12m" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/designer/analytics?period=${period}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

export const fetchDesignerProfile = createAsyncThunk(
  "designer/fetchDesignerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/designer/me");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateDesignerProfile = createAsyncThunk(
  "designer/updateDesignerProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/designer/me", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const designerSlice = createSlice({
  name: "designer",
  initialState: {
    profile: null,
    dashboard: null,
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDesignerError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchDashboardKPIs.pending, (s) => { s.loading = true; })
     .addCase(fetchDashboardKPIs.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload; })
     .addCase(fetchDashboardKPIs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchAnalytics.fulfilled, (s, a) => { s.analytics = a.payload; })
     .addCase(fetchDesignerProfile.fulfilled, (s, a) => { s.profile = a.payload; })
     .addCase(updateDesignerProfile.fulfilled, (s, a) => { s.profile = a.payload; });
  },
});

export const { clearDesignerError } = designerSlice.actions;
export default designerSlice.reducer;
