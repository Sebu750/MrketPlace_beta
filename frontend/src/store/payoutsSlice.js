import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

/* ── Thunks ─────────────────────────────────────────────── */
export const fetchPayouts = createAsyncThunk(
  "payouts/fetchPayouts",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      const { data } = await API.get(`/payouts/designer/payouts?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payouts");
    }
  }
);

export const fetchPayoutSummary = createAsyncThunk(
  "payouts/fetchPayoutSummary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/payouts/designer/payouts/summary");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch summary");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────── */
const payoutsSlice = createSlice({
  name: "payouts",
  initialState: {
    items: [],
    summary: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPayouts.pending, (s) => { s.loading = true; })
     .addCase(fetchPayouts.fulfilled, (s, a) => {
       s.loading = false;
       s.items = a.payload.data || a.payload.payouts || [];
       const pg = a.payload.pagination;
       s.page = pg?.page || 1;
       s.pages = pg?.pages || pg?.totalPages || 1;
     })
     .addCase(fetchPayouts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchPayoutSummary.fulfilled, (s, a) => { s.summary = a.payload.data || a.payload; });
  },
});

export default payoutsSlice.reducer;
