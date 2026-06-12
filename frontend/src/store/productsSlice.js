import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Public Thunks ─────────────────────────────────────────── */
export const fetchPublicProducts = createAsyncThunk(
  "products/fetchPublic",
  async ({ category, craft, designer, collection, search, priceMin, priceMax, sort, page = 1, limit = 24 } = {}, { rejectWithValue }) => {
    try {
      const p = new URLSearchParams();
      if (category) p.append("category", category);
      if (craft) p.append("craft", craft);
      if (designer) p.append("designer", designer);
      if (collection) p.append("collection", collection);
      if (search) p.append("search", search);
      if (priceMin) p.append("priceMin", priceMin);
      if (priceMax) p.append("priceMax", priceMax);
      if (sort) p.append("sort", sort);
      p.append("page", page);
      p.append("limit", limit);
      const { data } = await API.get(`/products?${p}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchPublicProduct = createAsyncThunk(
  "products/fetchPublicOne",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/products/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  }
);

/* ── Designer Thunks ─────────────────────────────────────────── */
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
      const { data } = await API.get(`/products/designer/products?${params}`);
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
      const { data } = await API.patch(`/products/${id}/status`);
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
    public: {
      items: [],
      current: null,
      loading: false,
      error: null,
      pagination: null,
    },
  },
  reducers: {
    clearProductError: (s) => { s.error = null; s.public.error = null; },
    setCurrentProduct: (s) => { s.current = null; s.public.current = null; },
    clearPublicProducts: (s) => { s.public.items = []; s.public.pagination = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMyProducts.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchMyProducts.fulfilled, (s, a) => {
       s.loading = false;
       s.items = a.payload.data || a.payload.products || [];
       const pg = a.payload.pagination;
       s.page = pg?.page || 1;
       s.pages = pg?.pages || pg?.totalPages || 1;
       s.total = pg?.total || 0;
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
     })
     /* ── Public products ── */
     .addCase(fetchPublicProducts.pending, (s) => { s.public.loading = true; s.public.error = null; })
     .addCase(fetchPublicProducts.fulfilled, (s, a) => {
       s.public.loading = false;
       s.public.items = a.payload.data || a.payload.products || [];
       const pg = a.payload.pagination;
       s.public.pagination = pg ? { ...pg, totalPages: pg.pages || pg.totalPages || 1 } : null;
     })
     .addCase(fetchPublicProducts.rejected, (s, a) => { s.public.loading = false; s.public.error = a.payload; })
     .addCase(fetchPublicProduct.pending, (s) => { s.public.loading = true; })
     .addCase(fetchPublicProduct.fulfilled, (s, a) => {
       s.public.loading = false;
       s.public.current = a.payload.data || a.payload;
     })
     .addCase(fetchPublicProduct.rejected, (s, a) => { s.public.loading = false; s.public.error = a.payload; });
  },
});

export const { clearProductError, setCurrentProduct, clearPublicProducts } = productsSlice.actions;
export default productsSlice.reducer;
