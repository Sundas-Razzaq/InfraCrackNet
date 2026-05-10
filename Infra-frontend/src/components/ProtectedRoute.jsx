import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthLoading, isAuthenticated, navigate]);

    if (isAuthLoading) {
        return <p style={{ textAlign: "center", marginTop: "3rem" }}>Checking session...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
