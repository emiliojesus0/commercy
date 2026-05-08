import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

function GuestRoute({ children }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
