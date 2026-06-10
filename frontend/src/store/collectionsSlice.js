import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchMyCollections = createAsyncThunk(
  "collections/fetchMyCollections",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/collections/my");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch collections");
    }
  }
);

export const fetchCollectionBySlug = createAsyncThunk(
  "collections/fetchCollectionBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/collections/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch collection");
    }
  }
);

export const createCollection = createAsyncThunk(
  "collections/createCollection",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/collections", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create collection");
    }
  }
);

export const updateCollection = createAsyncThunk(
  "collections/updateCollection",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/collections/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update collection");
    }
  }
);

export const updateCollectionStatus = createAsyncThunk(
  "collections/updateCollectionStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/collections/${id}/status`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCollectionError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMyCollections.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchMyCollections.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchMyCollections.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchCollectionBySlug.fulfilled, (s, a) => { s.current = a.payload; })
     .addCase(createCollection.fulfilled, (s, a) => { s.items.unshift(a.payload); })
     .addCase(updateCollection.fulfilled, (s, a) => {
       const i = s.items.findIndex((c) => c._id === a.payload._id);
       if (i >= 0) s.items[i] = a.payload;
       if (s.current?._id === a.payload._id) s.current = a.payload;
     })
     .addCase(updateCollectionStatus.fulfilled, (s, a) => {
       const i = s.items.findIndex((c) => c._id === a.payload._id);
       if (i >= 0) s.items[i] = a.payload;
     });
  },
});

export const { clearCollectionError } = collectionsSlice.actions;
export default collectionsSlice.reducer;
