import { useEffect, useState } from "react";
import {
    getCurrentUser,
    login as loginApi,
    logout as logoutApi,
} from "../api/authApi";
import AuthContext from "./authContext";

const readPersistedAuth = () => {
    try {
        const saved = localStorage.getItem("authState");
        if (!saved) {
            return { isAuthenticated: false, user: null, token: null };
        }

        const parsed = JSON.parse(saved);
        return {
            isAuthenticated: Boolean(parsed?.isAuthenticated),
            user: parsed?.user || null,
            token: parsed?.token || null,
        };
    } catch {
        return { isAuthenticated: false, user: null, token: null };
    }
};

export function AuthProvider({ children }) {
    const initial = readPersistedAuth();
    const [user, setUser] = useState(initial.user);
    const [token, setToken] = useState(initial.token);
    const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const persistAuth = (nextUser, nextToken = null) => {
        const nextState = {
            user: nextUser,
            token: nextToken,
            isAuthenticated: Boolean(nextUser),
        };

        setUser(nextUser);
        setToken(nextToken);
        setIsAuthenticated(Boolean(nextUser));
        localStorage.setItem("authState", JSON.stringify(nextState));
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authState");
    };

    const checkAuth = async () => {
        setIsAuthLoading(true);
        try {
            const data = await getCurrentUser();
            persistAuth(data.user, token);
        } catch {
            clearAuth();
        } finally {
            setIsAuthLoading(false);
        }
    };

    const loginUser = async (credentials) => {
        const data = await loginApi(credentials);
        persistAuth(data.user, data.token || null);
        return data;
    };

    const logoutUser = async () => {
        try {
            await logoutApi();
        } finally {
            clearAuth();
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadAuthState = async () => {
            if (!isMounted) {
                return;
            }

            await checkAuth();
        };

        loadAuthState();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        isAuthLoading,
        loginUser,
        logoutUser,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
