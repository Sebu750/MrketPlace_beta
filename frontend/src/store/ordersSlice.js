import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchDesignerOrders = createAsyncThunk(
  "orders/fetchDesignerOrders",
  async ({ status, search, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await API.get(`/orders/designer?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
    }
  }
);

export const advanceOrderStatus = createAsyncThunk(
  "orders/advanceOrderStatus",
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/orders/${id}/status`, { status, notes });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update order");
    }
  }
);

export const addTracking = createAsyncThunk(
  "orders/addTracking",
  async ({ id, trackingNumber, carrier, url }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/orders/${id}/tracking`, { trackingNumber, carrier, url });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add tracking");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const ordersSlice = createSlice({
  name: "orders",
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
    clearOrderError: (s) => { s.error = null; },
    setCurrentOrder: (s) => { s.current = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchDesignerOrders.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchDesignerOrders.fulfilled, (s, a) => {
       s.loading = false;
       s.items = a.payload.orders;
       s.page = a.payload.page;
       s.pages = a.payload.pages;
       s.total = a.payload.total;
     })
     .addCase(fetchDesignerOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchOrder.fulfilled, (s, a) => { s.current = a.payload; })
     .addCase(advanceOrderStatus.fulfilled, (s, a) => {
       if (s.current?._id === a.payload._id) s.current = a.payload;
       const i = s.items.findIndex((o) => o._id === a.payload._id);
       if (i >= 0) s.items[i] = a.payload;
     })
     .addCase(addTracking.fulfilled, (s, a) => {
       if (s.current?._id === a.payload._id) s.current = a.payload;
     });
  },
});

export const { clearOrderError, setCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
