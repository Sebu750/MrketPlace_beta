import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Platform Stats ──────────────────────────────────── */
export const fetchPlatformStats = createAsyncThunk(
  "admin/fetchPlatformStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/admin/stats");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchPlatformAnalytics = createAsyncThunk(
  "admin/fetchPlatformAnalytics",
  async ({ months = 12 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/admin/analytics?months=${months}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

/* ── Users ───────────────────────────────────────────── */
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ role, search, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/users?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/users/${id}`, { role });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
  }
);

/* ── Designers ───────────────────────────────────────── */
export const fetchAdminDesigners = createAsyncThunk(
  "admin/fetchDesigners",
  async ({ search, verified, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (verified !== undefined) params.append("verified", verified);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/designers?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch designers");
    }
  }
);

export const updateDesigner = createAsyncThunk(
  "admin/updateDesigner",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/designers/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update designer");
    }
  }
);

export const deleteDesigner = createAsyncThunk(
  "admin/deleteDesigner",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/designers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete designer");
    }
  }
);

/* ── Orders ──────────────────────────────────────────── */
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async ({ status, search, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/orders?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const adminUpdateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/orders/${id}/status`, { status, note });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update order");
    }
  }
);

/* ── Collections ─────────────────────────────────────── */
export const fetchAdminCollections = createAsyncThunk(
  "admin/fetchCollections",
  async ({ status, search, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/collections?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch collections");
    }
  }
);

export const adminUpdateCollection = createAsyncThunk(
  "admin/updateCollection",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/collections/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update collection");
    }
  }
);

/* ── Payouts ─────────────────────────────────────────── */
export const fetchAdminPayouts = createAsyncThunk(
  "admin/fetchPayouts",
  async ({ status, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/payouts?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payouts");
    }
  }
);

export const processPayout = createAsyncThunk(
  "admin/processPayout",
  async ({ id, status = "processed" }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/payouts/${id}`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to process payout");
    }
  }
);

/* ── Products ────────────────────────────────────────── */
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async ({ status, category, search, page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/admin/products?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

/* ── Reviews ─────────────────────────────────────────── */
export const fetchAdminReviews = createAsyncThunk(
  "admin/fetchReviews",
  async ({ page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      const { data } = await API.get(`/admin/reviews?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/reviews/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete review");
    }
  }
);

/* ── Helpers ──────────────────────────────────────────── */
const normPag = (p) => p ? { ...p, totalPages: p.pages || p.totalPages || 1 } : null;

/* ── Slice ───────────────────────────────────────────── */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    analytics: null,
    users: { items: [], pagination: null },
    designers: { items: [], pagination: null },
    orders: { items: [], pagination: null },
    collections: { items: [], pagination: null },
    payouts: { items: [], summary: {}, pagination: null },
    products: { items: [], pagination: null },
    reviews: { items: [], pagination: null },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    // Stats
    b.addCase(fetchPlatformStats.pending, (s) => { s.loading = true; })
     .addCase(fetchPlatformStats.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload; })
     .addCase(fetchPlatformStats.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
    // Analytics
     .addCase(fetchPlatformAnalytics.fulfilled, (s, a) => { s.analytics = a.payload; })
    // Users
     .addCase(fetchAdminUsers.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminUsers.fulfilled, (s, a) => {
       s.loading = false;
       s.users.items = a.payload.data || [];
       s.users.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(updateUserRole.fulfilled, (s, a) => {
       const updated = a.payload.data || a.payload;
       const idx = s.users.items.findIndex((u) => u._id === updated._id);
       if (idx !== -1) s.users.items[idx] = updated;
     })
     .addCase(deleteUser.fulfilled, (s, a) => {
       s.users.items = s.users.items.filter((u) => u._id !== a.payload);
     })
    // Designers
     .addCase(fetchAdminDesigners.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminDesigners.fulfilled, (s, a) => {
       s.loading = false;
       s.designers.items = a.payload.data || [];
       s.designers.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminDesigners.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(updateDesigner.fulfilled, (s, a) => {
       const updated = a.payload.data || a.payload;
       const idx = s.designers.items.findIndex((d) => d._id === updated._id);
       if (idx !== -1) s.designers.items[idx] = updated;
     })
     .addCase(deleteDesigner.fulfilled, (s, a) => {
       s.designers.items = s.designers.items.filter((d) => d._id !== a.payload);
     })
    // Orders
     .addCase(fetchAdminOrders.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminOrders.fulfilled, (s, a) => {
       s.loading = false;
       s.orders.items = a.payload.data || [];
       s.orders.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(adminUpdateOrderStatus.fulfilled, (s, a) => {
       const updated = a.payload.data || a.payload;
       const idx = s.orders.items.findIndex((o) => o._id === updated._id);
       if (idx !== -1) s.orders.items[idx] = updated;
     })
    // Collections
     .addCase(fetchAdminCollections.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminCollections.fulfilled, (s, a) => {
       s.loading = false;
       s.collections.items = a.payload.data || [];
       s.collections.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminCollections.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(adminUpdateCollection.fulfilled, (s, a) => {
       const updated = a.payload.data || a.payload;
       const idx = s.collections.items.findIndex((c) => c._id === updated._id);
       if (idx !== -1) s.collections.items[idx] = updated;
     })
    // Payouts
     .addCase(fetchAdminPayouts.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminPayouts.fulfilled, (s, a) => {
       s.loading = false;
       s.payouts.items = a.payload.data || [];
       s.payouts.summary = a.payload.summary || {};
       s.payouts.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminPayouts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(processPayout.fulfilled, (s, a) => {
       const updated = a.payload.data || a.payload;
       const idx = s.payouts.items.findIndex((p) => p._id === updated._id);
       if (idx !== -1) s.payouts.items[idx] = updated;
     })
    // Products
     .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminProducts.fulfilled, (s, a) => {
       s.loading = false;
       s.products.items = a.payload.data || [];
       s.products.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
    // Reviews
     .addCase(fetchAdminReviews.pending, (s) => { s.loading = true; })
     .addCase(fetchAdminReviews.fulfilled, (s, a) => {
       s.loading = false;
       s.reviews.items = a.payload.data || [];
       s.reviews.pagination = normPag(a.payload.pagination);
     })
     .addCase(fetchAdminReviews.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(deleteReview.fulfilled, (s, a) => {
       s.reviews.items = s.reviews.items.filter((r) => r._id !== a.payload);
     });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
