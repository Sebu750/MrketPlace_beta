import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── localStorage helpers (pre-login fallback) ─────────────────────── */
const LS_WISHLIST = "adorzia_wishlist";
const LS_ADDRESSES = "adorzia_addresses";

const loadLS = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};
const saveLS = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* silent */ }
};

const hasToken = () => !!localStorage.getItem("token");

/* ══════════════════════════════════════════════════════════════════════
   THUNKS , Orders
══════════════════════════════════════════════════════════════════════ */
export const fetchCustomerOrders = createAsyncThunk(
  "customer/fetchOrders",
  async ({ status, search, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const p = new URLSearchParams();
      if (status) p.append("status", status);
      if (search) p.append("search", search);
      p.append("page", page);
      p.append("limit", limit);
      const { data } = await API.get(`/orders?${p}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchCustomerOrder = createAsyncThunk(
  "customer/fetchOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   THUNKS , Stats
══════════════════════════════════════════════════════════════════════ */
export const fetchCustomerStats = createAsyncThunk(
  "customer/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/customer/stats");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   THUNKS , Wishlist
══════════════════════════════════════════════════════════════════════ */
export const fetchWishlist = createAsyncThunk(
  "customer/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/customer/wishlist");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const toggleWishlistAPI = createAsyncThunk(
  "customer/toggleWishlistAPI",
  async (item, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/customer/wishlist", item);
      return { items: data, toggled: item.productId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update wishlist");
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "customer/removeWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/customer/wishlist/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   THUNKS , Addresses
══════════════════════════════════════════════════════════════════════ */
export const fetchAddresses = createAsyncThunk(
  "customer/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/customer/addresses");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

export const addAddressAPI = createAsyncThunk(
  "customer/addAddressAPI",
  async (address, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/customer/addresses", address);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add address");
    }
  }
);

export const updateAddressAPI = createAsyncThunk(
  "customer/updateAddressAPI",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/customer/addresses/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update address");
    }
  }
);

export const removeAddressAPI = createAsyncThunk(
  "customer/removeAddressAPI",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/customer/addresses/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove address");
    }
  }
);

export const setDefaultAddressAPI = createAsyncThunk(
  "customer/setDefaultAddressAPI",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/customer/addresses/${id}/default`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to set default");
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   THUNKS , Reviews
══════════════════════════════════════════════════════════════════════ */
export const fetchMyReviews = createAsyncThunk(
  "customer/fetchMyReviews",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/customer/reviews?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════════════════════════════ */
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    orders: {
      items: [],
      current: null,
      loading: false,
      error: null,
      pagination: null,
    },
    stats: { data: null, loading: false },
    wishlist: loadLS(LS_WISHLIST, []),
    wishlistLoading: false,
    addresses: loadLS(LS_ADDRESSES, []),
    addressesLoading: false,
    reviews: { items: [], loading: false, pagination: null },
  },
  reducers: {
    clearOrderError: (s) => { s.orders.error = null; },
    clearCurrentOrder: (s) => { s.orders.current = null; },

    /* ── Sync wishlist (pre-login / optimistic) ── */
    toggleWishlist: (s, { payload }) => {
      const exists = s.wishlist.find((p) => p.productId === payload.productId);
      if (exists) {
        s.wishlist = s.wishlist.filter((p) => p.productId !== payload.productId);
      } else {
        s.wishlist.push(payload);
      }
      saveLS(LS_WISHLIST, s.wishlist);
    },
    removeFromWishlist: (s, { payload }) => {
      s.wishlist = s.wishlist.filter((p) => p.productId !== payload);
      saveLS(LS_WISHLIST, s.wishlist);
    },

    /* ── Sync addresses (pre-login / optimistic) ── */
    addAddress: (s, { payload }) => {
      const addr = {
        ...payload,
        id: `addr_${Date.now()}`,
        isDefault: s.addresses.length === 0 ? true : (payload.isDefault || false),
      };
      if (addr.isDefault) {
        s.addresses.forEach((a) => { a.isDefault = false; });
      }
      s.addresses.push(addr);
      saveLS(LS_ADDRESSES, s.addresses);
    },
    updateAddress: (s, { payload }) => {
      const idx = s.addresses.findIndex((a) => a.id === payload.id);
      if (idx !== -1) {
        if (payload.isDefault) {
          s.addresses.forEach((a) => { a.isDefault = false; });
        }
        s.addresses[idx] = payload;
      }
      saveLS(LS_ADDRESSES, s.addresses);
    },
    removeAddress: (s, { payload }) => {
      s.addresses = s.addresses.filter((a) => a.id !== payload);
      saveLS(LS_ADDRESSES, s.addresses);
    },
    setDefaultAddress: (s, { payload }) => {
      s.addresses.forEach((a) => { a.isDefault = a.id === payload; });
      saveLS(LS_ADDRESSES, s.addresses);
    },
  },
  extraReducers: (b) => {
    /* ── fetchOrders ── */
    b.addCase(fetchCustomerOrders.pending, (s) => {
      s.orders.loading = true;
      s.orders.error = null;
    });
    b.addCase(fetchCustomerOrders.fulfilled, (s, a) => {
      s.orders.loading = false;
      s.orders.items = a.payload.data || a.payload.orders || [];
      const pg = a.payload.pagination;
      s.orders.pagination = pg ? { ...pg, totalPages: pg.pages || pg.totalPages || 1 } : null;
    });
    b.addCase(fetchCustomerOrders.rejected, (s, a) => {
      s.orders.loading = false;
      s.orders.error = a.payload;
    });

    /* ── fetchOrder ── */
    b.addCase(fetchCustomerOrder.fulfilled, (s, a) => {
      s.orders.current = a.payload.data || a.payload;
    });

    /* ── fetchStats ── */
    b.addCase(fetchCustomerStats.pending, (s) => { s.stats.loading = true; });
    b.addCase(fetchCustomerStats.fulfilled, (s, a) => {
      s.stats.loading = false;
      s.stats.data = a.payload.data || a.payload;
    });
    b.addCase(fetchCustomerStats.rejected, (s) => { s.stats.loading = false; });

    /* ── fetchWishlist ── */
    b.addCase(fetchWishlist.pending, (s) => { s.wishlistLoading = true; });
    b.addCase(fetchWishlist.fulfilled, (s, a) => {
      s.wishlistLoading = false;
      const items = (a.payload.data || a.payload || []).map((item) => ({
        productId: item.productId || item.product?._id || item.product,
        name: item.name || item.product?.name,
        price: item.price || item.product?.price,
        priceFormatted: item.priceFormatted || item.product?.priceFormatted,
        image: item.image || item.product?.images?.[0]?.url,
        designer: item.designer || item.product?.designer?.brandName,
        size: item.size,
        color: item.color,
      }));
      s.wishlist = items;
      saveLS(LS_WISHLIST, s.wishlist);
    });
    b.addCase(fetchWishlist.rejected, (s) => { s.wishlistLoading = false; });

    /* ── toggleWishlistAPI ── */
    b.addCase(toggleWishlistAPI.fulfilled, (s, a) => {
      const items = (a.payload.items || []).map((item) => ({
        productId: item.productId || item.product?._id || item.product,
        name: item.name || item.product?.name,
        price: item.price || item.product?.price,
        priceFormatted: item.priceFormatted || item.product?.priceFormatted,
        image: item.image || item.product?.images?.[0]?.url,
        designer: item.designer || item.product?.designer?.brandName,
        size: item.size,
        color: item.color,
      }));
      s.wishlist = items;
      saveLS(LS_WISHLIST, s.wishlist);
    });

    /* ── removeWishlistItem ── */
    b.addCase(removeWishlistItem.fulfilled, (s, a) => {
      const items = (a.payload || []).map((item) => ({
        productId: item.productId || item.product?._id || item.product,
        name: item.name || item.product?.name,
        price: item.price || item.product?.price,
        priceFormatted: item.priceFormatted || item.product?.priceFormatted,
        image: item.image || item.product?.images?.[0]?.url,
        designer: item.designer || item.product?.designer?.brandName,
        size: item.size,
        color: item.color,
      }));
      s.wishlist = items;
      saveLS(LS_WISHLIST, s.wishlist);
    });

    /* ── fetchAddresses ── */
    b.addCase(fetchAddresses.pending, (s) => { s.addressesLoading = true; });
    b.addCase(fetchAddresses.fulfilled, (s, a) => {
      s.addressesLoading = false;
      s.addresses = a.payload.data || a.payload || [];
      saveLS(LS_ADDRESSES, s.addresses);
    });
    b.addCase(fetchAddresses.rejected, (s) => { s.addressesLoading = false; });

    /* ── addAddressAPI ── */
    b.addCase(addAddressAPI.fulfilled, (s, a) => {
      s.addresses = a.payload || s.addresses;
      saveLS(LS_ADDRESSES, s.addresses);
    });

    /* ── updateAddressAPI ── */
    b.addCase(updateAddressAPI.fulfilled, (s, a) => {
      s.addresses = a.payload || s.addresses;
      saveLS(LS_ADDRESSES, s.addresses);
    });

    /* ── removeAddressAPI ── */
    b.addCase(removeAddressAPI.fulfilled, (s, a) => {
      s.addresses = a.payload || s.addresses;
      saveLS(LS_ADDRESSES, s.addresses);
    });

    /* ── setDefaultAddressAPI ── */
    b.addCase(setDefaultAddressAPI.fulfilled, (s, a) => {
      s.addresses = a.payload || s.addresses;
      saveLS(LS_ADDRESSES, s.addresses);
    });

    /* ── fetchMyReviews ── */
    b.addCase(fetchMyReviews.pending, (s) => { s.reviews.loading = true; });
    b.addCase(fetchMyReviews.fulfilled, (s, a) => {
      s.reviews.loading = false;
      s.reviews.items = a.payload.data || a.payload || [];
      const pg = a.payload.pagination;
      s.reviews.pagination = pg ? { ...pg, totalPages: pg.pages || pg.totalPages || 1 } : null;
    });
    b.addCase(fetchMyReviews.rejected, (s) => { s.reviews.loading = false; });
  },
});

export const {
  clearOrderError,
  clearCurrentOrder,
  toggleWishlist,
  removeFromWishlist,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} = customerSlice.actions;

export default customerSlice.reducer;
