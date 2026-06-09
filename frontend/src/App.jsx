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

// Dashboard pages
import CustomerDashboard from "./pages/CustomerDashboard";
import DesignerDashboard from "./pages/DesignerDashboard";
import AdminPanel from "./pages/AdminPanel";

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
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <DesignerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
