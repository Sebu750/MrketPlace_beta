import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async ({ status, category, collection, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (category) params.append("category", category);
      if (collection) params.append("collection", collection);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/products/my?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchMyProductBySlug = createAsyncThunk(
  "products/fetchMyProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/products/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/products", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/products/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "products/toggleProductStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/products/${id}/toggle`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {
    clearProductError: (s) => { s.error = null; },
    setCurrentProduct: (s) => { s.current = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMyProducts.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchMyProducts.fulfilled, (s, a) => {
       s.loading = false;
       s.items = a.payload.products;
       s.page = a.payload.page;
       s.pages = a.payload.pages;
       s.total = a.payload.total;
     })
     .addCase(fetchMyProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchMyProductBySlug.fulfilled, (s, a) => { s.current = a.payload; })
     .addCase(createProduct.fulfilled, (s, a) => { s.items.unshift(a.payload); s.total += 1; })
     .addCase(updateProduct.fulfilled, (s, a) => {
       const i = s.items.findIndex((p) => p._id === a.payload._id);
       if (i >= 0) s.items[i] = a.payload;
       if (s.current?._id === a.payload._id) s.current = a.payload;
     })
     .addCase(deleteProduct.fulfilled, (s, a) => {
       s.items = s.items.filter((p) => p._id !== a.payload);
       s.total -= 1;
     })
     .addCase(toggleProductStatus.fulfilled, (s, a) => {
       const i = s.items.findIndex((p) => p._id === a.payload._id);
       if (i >= 0) s.items[i] = a.payload;
     });
  },
});

export const { clearProductError, setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
