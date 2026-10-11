import {
    faBell,
    faChartLine,
    faClipboardCheck,
    faFolderOpen,
    faGaugeHigh,
    faGear,
    faFileLines,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

// If allowedRoles is omitted, item shows for everyone authenticated.
export const sidebarItems = [
    {
        id: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: faGaugeHigh,
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard",
    },

    {
        id: "projects",
        title: "Projects",
        path: "/dashboard/projects",
        icon: faFolderOpen,
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/projects" ||
            pathname.startsWith("/dashboard/projects/"),
    },

    {
        id: "inspection",
        title: "Inspection",
        path: "/dashboard/inspection",
        icon: faClipboardCheck,
        allowedRoles: ["Engineer", "Inspector"],
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
        allowedRoles: ["Engineer", "Inspector"],
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
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/reports" ||
            pathname.startsWith("/dashboard/reports/"),
    },

    {
        id: "team",
        title: "Team Management",
        path: "/dashboard/team",
        icon: faUsers,
        // CHANGED: Engineer-only — Inspector does not manage the team.
        allowedRoles: ["Engineer"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/team" ||
            pathname.startsWith("/dashboard/team/"),
    },

    {
        id: "notifications",
        title: "Notifications",
        path: "/dashboard/notifications",
        icon: faBell,
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/notifications" ||
            pathname.startsWith("/dashboard/notifications/"),
    },

    {
        id: "profile",
        title: "Profile",
        path: "/dashboard/profile",
        icon: faUser,
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/profile" ||
            pathname.startsWith("/dashboard/profile/"),
    },

    {
        id: "settings",
        title: "Settings",
        path: "/dashboard/settings",
        icon: faGear,
        allowedRoles: ["Engineer", "Inspector"],
        activeMatch: (pathname) =>
            pathname === "/dashboard/settings" ||
            pathname.startsWith("/dashboard/settings/"),
    },
];