import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productsReducer from "./productsSlice";
import collectionsReducer from "./collectionsSlice";
import ordersReducer from "./ordersSlice";
import designerReducer from "./designerSlice";
import payoutsReducer from "./payoutsSlice";
import adminReducer from "./adminSlice";
import customerReducer from "./customerSlice";
import craftsReducer from "./craftsSlice";
import editorialReducer from "./editorialSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsReducer,
    collections: collectionsReducer,
    orders: ordersReducer,
    designer: designerReducer,
    payouts: payoutsReducer,
    admin: adminReducer,
    customer: customerReducer,
    crafts: craftsReducer,
    editorial: editorialReducer,
  },
});
