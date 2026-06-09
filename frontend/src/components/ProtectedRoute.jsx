import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { data: user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Route to the login page that matches the required role
    const loginPath =
      allowedRoles?.includes("admin")  ? "/admin/login" :
      allowedRoles?.includes("seller") ? "/designer/login" :
      "/customer/login";
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "seller") return <Navigate to="/designer-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
