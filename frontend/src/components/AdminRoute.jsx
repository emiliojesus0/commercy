import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../services/authService";

function AdminRoute({ children }) {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
