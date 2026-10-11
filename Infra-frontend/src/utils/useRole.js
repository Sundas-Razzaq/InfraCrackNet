import { useAuth } from "../context/useAuth";

export const useRole = () => {
    const { user } = useAuth();

    const role = user?.role || null;

    return {
        role,
        isEngineer: role === "Engineer",
        isInspector: role === "Inspector",
        isAdmin: role === "Admin",
    };
};