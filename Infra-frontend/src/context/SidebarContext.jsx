import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SidebarContext = createContext(null);

const MOBILE_BREAKPOINT = 1100;

const isBrowser = typeof window !== "undefined";

const getIsMobileView = () => {
    if (!isBrowser) {
        return false;
    }

    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
};

const getInitialCollapsedState = () => {
    if (!isBrowser) {
        return false;
    }

    return window.innerWidth < 1280;
};

export function SidebarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(getIsMobileView);

    useEffect(() => {
        if (!isBrowser) {
            return undefined;
        }

        const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

        const handleChange = (event) => {
            setIsMobileView(event.matches);
        };

        setIsMobileView(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    useEffect(() => {
        if (!isMobileView) {
            setIsMobileOpen(false);
        }
    }, [isMobileView]);

    const toggleSidebar = () => {
        if (isMobileView) {
            setIsMobileOpen((current) => !current);
            return;
        }

        setIsCollapsed((current) => !current);
    };

    const openSidebar = () => setIsMobileOpen(true);
    const closeSidebar = () => setIsMobileOpen(false);

    const value = useMemo(
        () => ({
            isCollapsed,
            isMobileOpen,
            isMobileView,
            toggleSidebar,
            openSidebar,
            closeSidebar,
            setIsCollapsed,
        }),
        [isCollapsed, isMobileOpen, isMobileView],
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return context;
}