import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import DesignerProfile from "./pages/DesignerProfile";
import CollectionDetail from "./pages/CollectionDetail";
import ProductDetail from "./pages/ProductDetail";
import DesignerDirectory from "./pages/DesignerDirectory";
import Products from "./pages/Products";
import CollectionsDirectory from "./pages/CollectionsDirectory";
import Shop from "./pages/Shop";
import CraftsArchive from "./pages/CraftsArchive";
import CraftDetail from "./pages/CraftDetail";
import Editorial from "./pages/Editorial";

// Auth pages — Customer
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";

// Auth pages — Designer
import DesignerLogin from "./pages/DesignerLogin";
import DesignerRegister from "./pages/DesignerRegister";

// Designer — public pages
import DesignerPlans from "./pages/DesignerPlans";

// Auth pages — Admin
import AdminLogin from "./pages/AdminLogin";

// Customer Dashboard — nested layout
import CustomerLayout from "./pages/CustomerLayout";
import CustomerOverview from "./pages/CustomerOverview";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerOrderDetail from "./pages/CustomerOrderDetail";
import CustomerWishlist from "./pages/CustomerWishlist";
import CustomerAddresses from "./pages/CustomerAddresses";
import CustomerReviews from "./pages/CustomerReviews";
import CustomerSettings from "./pages/CustomerSettings";

// Admin Dashboard — nested layout
import AdminLayout from "./pages/AdminLayout";
import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminDesigners from "./pages/AdminDesigners";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCollections from "./pages/AdminCollections";
import AdminPayouts from "./pages/AdminPayouts";
import AdminReports from "./pages/AdminReports";
import AdminReviews from "./pages/AdminReviews";
import AdminSettings from "./pages/AdminSettings";

// Designer Dashboard — nested layout
import DesignerLayout from "./pages/DesignerLayout";
import DesignerOverview from "./pages/DesignerOverview";
import DesignerCollections from "./pages/DesignerCollections";
import DesignerCollectionForm from "./pages/DesignerCollectionForm";
import DesignerProducts from "./pages/DesignerProducts";
import DesignerProductForm from "./pages/DesignerProductForm";
import DesignerOrders from "./pages/DesignerOrders";
import DesignerOrderDetail from "./pages/DesignerOrderDetail";
import DesignerAnalytics from "./pages/DesignerAnalytics";
import DesignerPayouts from "./pages/DesignerPayouts";
import DesignerProfileSettings from "./pages/DesignerProfileSettings";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="designers" element={<DesignerDirectory />} />
          <Route path="products" element={<Products />} />
          <Route path="shop" element={<Shop />} />
          <Route path="crafts" element={<CraftsArchive />} />
          <Route path="crafts/:slug" element={<CraftDetail />} />
          <Route path="editorial" element={<Editorial />} />
          <Route path="collections" element={<CollectionsDirectory />} />
          <Route path="collections/:slug" element={<CollectionDetail />} />
          <Route path="pieces/:id" element={<ProductDetail />} />
          {/* Designer profiles at root level — MUST be last to avoid catching other routes */}
          <Route path=":slug" element={<DesignerProfile />} />
        </Route>

        {/* ── Customer Auth (cream bg, warm) ────────────────────────────────── */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />

        {/* ── Designer public pages (pricing, etc.) ─────────────────────────── */}
        <Route path="/designer/plans" element={<DesignerPlans />} />

        {/* ── Designer Auth (dark bg, gold accents) ─────────────────────────── */}
        <Route path="/designer/login" element={<DesignerLogin />} />
        <Route path="/designer/register" element={<DesignerRegister />} />

        {/* ── Admin Auth (near-black, restricted) ───────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Protected Dashboard Routes ────────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerOverview />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:id" element={<CustomerOrderDetail />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="addresses" element={<CustomerAddresses />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>
        <Route
          path="/designer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <DesignerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DesignerOverview />} />
          <Route path="collections" element={<DesignerCollections />} />
          <Route path="collections/new" element={<DesignerCollectionForm />} />
          <Route path="collections/:id/edit" element={<DesignerCollectionForm />} />
          <Route path="products" element={<DesignerProducts />} />
          <Route path="products/new" element={<DesignerProductForm />} />
          <Route path="products/:id/edit" element={<DesignerProductForm />} />
          <Route path="orders" element={<DesignerOrders />} />
          <Route path="orders/:id" element={<DesignerOrderDetail />} />
          <Route path="analytics" element={<DesignerAnalytics />} />
          <Route path="payouts" element={<DesignerPayouts />} />
          <Route path="settings" element={<DesignerProfileSettings />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="designers" element={<AdminDesigners />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}
