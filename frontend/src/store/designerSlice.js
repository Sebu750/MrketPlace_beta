import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchPublicDesigners = createAsyncThunk(
  "designer/fetchPublic",
  async ({ category, verified, search, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const p = new URLSearchParams();
      if (category) p.append("category", category);
      if (verified !== undefined) p.append("verified", verified);
      if (search) p.append("search", search);
      p.append("page", page);
      p.append("limit", limit);
      const { data } = await API.get(`/designers?${p}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch designers");
    }
  }
);

export const fetchPublicDesigner = createAsyncThunk(
  "designer/fetchPublicOne",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/designers/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch designer");
    }
  }
);

export const fetchDashboardKPIs = createAsyncThunk(
  "designer/fetchDashboardKPIs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/designers/dashboard");
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
      const { data } = await API.get(`/designers/analytics?period=${period}`);
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
      const { data } = await API.get("/designers/me");
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
      const { data } = await API.put("/designers/profile", payload);
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
    public: {
      items: [],
      current: null,
      loading: false,
      error: null,
      pagination: null,
    },
  },
  reducers: {
    clearDesignerError: (s) => { s.error = null; s.public.error = null; },
    clearPublicDesigners: (s) => { s.public.items = []; s.public.pagination = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchDashboardKPIs.pending, (s) => { s.loading = true; })
     .addCase(fetchDashboardKPIs.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload.data || a.payload; })
     .addCase(fetchDashboardKPIs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchAnalytics.fulfilled, (s, a) => { s.analytics = a.payload.data || a.payload; })
     .addCase(fetchDesignerProfile.fulfilled, (s, a) => { s.profile = a.payload.data || a.payload; })
     .addCase(updateDesignerProfile.fulfilled, (s, a) => { s.profile = a.payload.data || a.payload; })
     /* ── Public designers ── */
     .addCase(fetchPublicDesigners.pending, (s) => { s.public.loading = true; s.public.error = null; })
     .addCase(fetchPublicDesigners.fulfilled, (s, a) => {
       s.public.loading = false;
       s.public.items = a.payload.data || a.payload.designers || [];
       const pg = a.payload.pagination;
       s.public.pagination = pg ? { ...pg, totalPages: pg.pages || pg.totalPages || 1 } : null;
     })
     .addCase(fetchPublicDesigners.rejected, (s, a) => { s.public.loading = false; s.public.error = a.payload; })
     .addCase(fetchPublicDesigner.pending, (s) => { s.public.loading = true; })
     .addCase(fetchPublicDesigner.fulfilled, (s, a) => {
       s.public.loading = false;
       s.public.current = a.payload.data || a.payload;
     })
     .addCase(fetchPublicDesigner.rejected, (s, a) => { s.public.loading = false; s.public.error = a.payload; });
  },
});

export const { clearDesignerError, clearPublicDesigners } = designerSlice.actions;
export default designerSlice.reducer;
