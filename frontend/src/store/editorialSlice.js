import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ──────────────────────────────────────────────────────── */
export const fetchArticles = createAsyncThunk(
  "editorial/fetchArticles",
  async ({ search, category, featured, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const p = new URLSearchParams();
      if (search) p.append("search", search);
      if (category) p.append("category", category);
      if (featured !== undefined) p.append("featured", featured);
      p.append("page", page);
      p.append("limit", limit);
      const { data } = await API.get(`/editorial?${p}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch articles");
    }
  }
);

export const fetchArticleDetail = createAsyncThunk(
  "editorial/fetchArticleDetail",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/editorial/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch article");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────────────── */
const editorialSlice = createSlice({
  name: "editorial",
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
    clearArticleDetail: (state) => {
      state.detail.item = null;
      state.detail.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ── fetchArticles ─────────────────────────────────────────── */
      .addCase(fetchArticles.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.items = action.payload.data;
        state.list.pagination = action.payload.pagination;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      })
      /* ── fetchArticleDetail ──────────────────────────────────────── */
      .addCase(fetchArticleDetail.pending, (state) => {
        state.detail.loading = true;
        state.detail.error = null;
      })
      .addCase(fetchArticleDetail.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.item = action.payload.data;
      })
      .addCase(fetchArticleDetail.rejected, (state, action) => {
        state.detail.loading = false;
        state.detail.error = action.payload;
      });
  },
});

export const { clearArticleDetail } = editorialSlice.actions;
export default editorialSlice.reducer;
