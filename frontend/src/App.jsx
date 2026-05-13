import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateStorePage from "./pages/CreateStorePage";
import CreateProductPage from "./pages/CreateProductPage";
import OrdersPage from "./pages/OrdersPage";
import PublicStorePage from "./pages/PublicStorePage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CartPage from "./pages/CartPage";
import GuestRoute from "./components/GuestRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminRoute from "./components/AdminRoute";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-store"
            element={
              <ProtectedRoute>
                <CreateStorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-product"
            element={
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/store/:slug" element={<PublicStorePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
