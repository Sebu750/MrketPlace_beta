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

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

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
          <Route path="collections/:slug" element={<CollectionDetail />} />
          <Route path="pieces/:id" element={<ProductDetail />} />
          {/* Designer profiles at root level — MUST be last to avoid catching other routes */}
          <Route path=":slug" element={<DesignerProfile />} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard routes (no layout, custom headers) */}
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
