import { useEffect, useState } from "react";
import SignupPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, logoutUser } = useAuth();
  const [path, setPath] = useState(window.location.pathname || "/login");

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || "/login");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (path === "/signup") {
    return <SignupPage onNavigate={navigate} />;
  }

  if (path === "/login") {
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <ProtectedRoute onNavigate={navigate}>
      <main style={{ maxWidth: 640, margin: "4rem auto", padding: "1.5rem" }}>
        <h1>Dashboard</h1>
        <p>You are logged in.</p>
        {user ? (
          <pre style={{ background: "#f2f2f2", padding: "1rem", borderRadius: "8px" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={async () => {
            await logoutUser();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </main>
    </ProtectedRoute>
  );
}

export default App;
