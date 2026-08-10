import {
    faBell,
    faChartLine,
    faClipboardCheck,
    faClock,
    faFolderOpen,
    faGaugeHigh,
    faGear,
    faFileLines,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const sidebarItems = [
    {
        id: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: faGaugeHigh,
        activeMatch: (pathname) =>
            pathname === "/dashboard",
    },

    {
        id: "projects",
        title: "Projects",
        path: "/dashboard/projects",
        icon: faFolderOpen,
        activeMatch: (pathname) =>
            pathname === "/dashboard/projects" ||
            pathname.startsWith("/dashboard/projects/"),
    },

    {
        id: "inspection",
        title: "Inspection",
        path: "/dashboard/inspection",
        icon: faClipboardCheck,
        activeMatch: (pathname) => {
            if (!pathname.startsWith("/dashboard/inspection")) {
                return false;
            }

            return !(
                pathname.includes("/ai-analysis/") ||
                pathname.includes("/ai-results/") ||
                pathname.includes("/annotation/") ||
                pathname.includes("/validation/")
            );
        },
    },

    {
        id: "analytics",
        title: "Analytics",
        path: "/dashboard/ai-analysis",
        icon: faChartLine,
        activeMatch: (pathname) =>
            pathname.includes("/ai-analysis/") ||
            pathname.includes("/ai-results/") ||
            pathname.includes("/annotation/") ||
            pathname.includes("/validation/"),
    },

    {
        id: "reports",
        title: "Reports",
        path: "/dashboard/reports",
        icon: faFileLines,
        activeMatch: (pathname) =>
            pathname === "/dashboard/reports" ||
            pathname.startsWith("/dashboard/reports/"),
    },

    {
        id: "team",
        title: "Team Management",
        path: "/dashboard/team",
        icon: faUsers,
        activeMatch: (pathname) =>
            pathname === "/dashboard/team" ||
            pathname.startsWith("/dashboard/team/"),
    },

    {
        id: "history",
        title: "History",
        path: "/dashboard/inspection-history",
        icon: faClock,
        activeMatch: (pathname) =>
            pathname === "/dashboard/inspection-history" ||
            pathname.startsWith(
                "/dashboard/inspection-history/"
            ),
    },

    {
        id: "notifications",
        title: "Notifications",
        path: "/dashboard/notifications",
        icon: faBell,
        activeMatch: (pathname) =>
            pathname === "/dashboard/notifications" ||
            pathname.startsWith(
                "/dashboard/notifications/"
            ),
    },

    {
        id: "profile",
        title: "Profile",
        path: "/dashboard/profile",
        icon: faUser,
        activeMatch: (pathname) =>
            pathname === "/dashboard/profile" ||
            pathname.startsWith("/dashboard/profile/"),
    },

    {
        id: "settings",
        title: "Settings",
        path: "/dashboard/settings",
        icon: faGear,
        activeMatch: (pathname) =>
            pathname === "/dashboard/settings" ||
            pathname.startsWith("/dashboard/settings/"),
    },
];