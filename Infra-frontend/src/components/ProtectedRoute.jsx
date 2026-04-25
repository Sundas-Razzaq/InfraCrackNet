import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, onNavigate }) {
    const { isAuthenticated, isAuthLoading } = useAuth();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            onNavigate("/login");
        }
    }, [isAuthLoading, isAuthenticated, onNavigate]);

    if (isAuthLoading) {
        return <p style={{ textAlign: "center", marginTop: "3rem" }}>Checking session...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
