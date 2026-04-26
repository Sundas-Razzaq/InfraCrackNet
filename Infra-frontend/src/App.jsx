import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import LandingPage from "./pages/landing/landingPage";
import SignupPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import ResetPasswordPage from "./pages/auth/resetPassword";
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
  return <ResetPasswordPage onNavigate={navigate} token={token} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
        <Route path="/reset-password/:token" element={<ResetPasswordRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
