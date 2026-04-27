import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import RoleSelect from "./pages/Auth/RoleSelect";
import UserLogin from "./pages/Auth/UserLogin";
import UserRegister from "./pages/Auth/UserRegister";
import ShopkeeperLogin from "./pages/Auth/ShopkeeperLogin";
import ShopkeeperRegister from "./pages/Auth/ShopkeeperRegister";
import AdminLogin from "./pages/Auth/AdminLogin";
import UserDashboard from "./pages/User/UserDashboard";
import ShopkeeperDashboard from "./pages/Shopkeeper/ShopkeeperDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<RoleSelect />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/login/shopkeeper" element={<ShopkeeperLogin />} />
      <Route path="/register/shopkeeper" element={<ShopkeeperRegister />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopkeeper/dashboard"
        element={
          <ProtectedRoute allowedRoles={["shopowner"]}>
            <ShopkeeperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
