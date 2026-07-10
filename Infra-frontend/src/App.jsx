import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import LandingPage from "./pages/landing/landingPage";

import SignupPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import ResetPasswordPage from "./pages/auth/resetPassword";

import DashboardLayout from "./layouts/DashboardLayout";

import DashboardHome from "./pages/dashboard/dashboardHome";
import Profile from "./pages/dashboard/profile";
import Notifications from "./pages/dashboard/notifications";
import Settings from "./pages/dashboard/settings";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function LoginRoute() {
  const navigate = useNavigate();
  return <LoginPage onNavigate={navigate} />;
}

function SignupRoute() {
  const navigate = useNavigate();
  return <SignupPage onNavigate={navigate} />;
}

function ForgotPasswordRoute() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onNavigate={navigate} />;
}

function ResetPasswordRoute() {
  const navigate = useNavigate();
  const { token = "" } = useParams();

  return (
    <ResetPasswordPage
      onNavigate={navigate}
      token={token}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={<LoginRoute />}
        />

        <Route
          path="/signup"
          element={<SignupRoute />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordRoute />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordRoute />}
        />

        {/* Protected Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<DashboardHome />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;