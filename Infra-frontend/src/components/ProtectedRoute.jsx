import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const {
        isAuthenticated,
        isAuthLoading,
        user,
    } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthLoading) return;

        // User not logged in
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // User logged in but role not allowed
        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(user?.role)
        ) {
            navigate("/");
        }
    }, [
        isAuthenticated,
        isAuthLoading,
        navigate,
        allowedRoles,
        user,
    ]);

    if (isAuthLoading) {
        return (
            <p style={{ textAlign: "center", marginTop: "3rem" }}>
                Checking session...
            </p>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role)
    ) {
        return null;
    }

    return children;
}

export default ProtectedRoute;