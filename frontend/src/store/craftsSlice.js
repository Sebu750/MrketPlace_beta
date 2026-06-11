import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ──────────────────────────────────────────────────────── */
export const fetchCrafts = createAsyncThunk(
  "crafts/fetchCrafts",
  async ({ search, featured, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const p = new URLSearchParams();
      if (search) p.append("search", search);
      if (featured !== undefined) p.append("featured", featured);
      p.append("page", page);
      p.append("limit", limit);
      const { data } = await API.get(`/crafts?${p}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch crafts");
    }
  }
);

export const fetchCraftDetail = createAsyncThunk(
  "crafts/fetchCraftDetail",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/crafts/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch craft");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────────────── */
const craftsSlice = createSlice({
  name: "crafts",
  initialState: {
    list: {
      items: [],
      pagination: null,
      loading: false,
      error: null,
    },
    detail: {
      item: null,
      loading: false,
      error: null,
    },
  },
  reducers: {
    clearCraftDetail: (state) => {
      state.detail.item = null;
      state.detail.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ── fetchCrafts ─────────────────────────────────────────── */
      .addCase(fetchCrafts.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchCrafts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.items = action.payload.data;
        state.list.pagination = action.payload.pagination;
      })
      .addCase(fetchCrafts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      })
      /* ── fetchCraftDetail ──────────────────────────────────────── */
      .addCase(fetchCraftDetail.pending, (state) => {
        state.detail.loading = true;
        state.detail.error = null;
      })
      .addCase(fetchCraftDetail.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.item = action.payload.data;
      })
      .addCase(fetchCraftDetail.rejected, (state, action) => {
        state.detail.loading = false;
        state.detail.error = action.payload;
      });
  },
});

export const { clearCraftDetail } = craftsSlice.actions;
export default craftsSlice.reducer;
