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
    faUserShield,
    faPeopleGroup,
    faRobot,
    faClockRotateLeft,
    faUserGear,
} from "@fortawesome/free-solid-svg-icons";

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

//admin sidebar items
const adminMatch = (path) => (pathname) =>
    pathname === path || pathname.startsWith(`${path}/`);

// Admin sidebar: non-clickable group headings with items underneath.
export const adminSidebarGroups = [
    {
        id: "administration",
        title: "Administration",
        items: [
            {
                id: "dashboard",
                title: "Dashboard",
                path: "/dashboard/admin/dashboard",
                icon: faGaugeHigh,
                description:
                    "Total users, role distribution, active projects, inspection statuses, analysis processing status, and recent activity.",
                activeMatch: adminMatch("/dashboard/admin/dashboard"),
            },
            {
                id: "users",
                title: "User Management",
                path: "/dashboard/admin/users",
                icon: faUserShield,
                description:
                    "Invite Engineers and Inspectors by email, track invitation status, browse users, and manage authorized account roles or status.",
                activeMatch: adminMatch("/dashboard/admin/users"),
            },
            {
                id: "teams",
                title: "Team Management",
                path: "/dashboard/admin/teams",
                icon: faPeopleGroup,
                description:
                    "Create teams, assign one Engineer and their Inspectors, view team membership, and handle membership changes.",
                activeMatch: adminMatch("/dashboard/admin/teams"),
            },
        ],
    },
    {
        id: "operations",
        title: "Operations",
        items: [
            {
                id: "projects",
                title: "Projects",
                path: "/dashboard/admin/projects",
                icon: faFolderOpen,
                description:
                    "View all projects, assign or reassign teams, and monitor project progress.",
                activeMatch: adminMatch("/dashboard/admin/projects"),
            },
            {
                id: "inspections",
                title: "Inspections",
                path: "/dashboard/admin/inspections",
                icon: faClipboardCheck,
                description:
                    "Review inspection records, media-related workflow status, and validation progress.",
                activeMatch: adminMatch("/dashboard/admin/inspections"),
            },
            {
                id: "analyses",
                title: "AI Analyses",
                path: "/dashboard/admin/analyses",
                icon: faRobot,
                description:
                    "Monitor queued, processing, completed, failed, and cancelled analyses.",
                activeMatch: adminMatch("/dashboard/admin/analyses"),
            },
            {
                id: "reports",
                title: "Reports",
                path: "/dashboard/admin/reports",
                icon: faFileLines,
                description:
                    "Browse and download generated reports and see which projects and inspections they belong to.",
                activeMatch: adminMatch("/dashboard/admin/reports"),
            },
        ],
    },
    {
        id: "oversight",
        title: "Oversight",
        items: [
            {
                id: "activity-log",
                title: "Activity Log",
                path: "/dashboard/admin/activity-log",
                icon: faClockRotateLeft,
                description:
                    "Record important actions such as invitations, role changes, team membership changes, project assignments, and report generation.",
                activeMatch: adminMatch("/dashboard/admin/activity-log"),
            },
        ],
    },
    {
        id: "account",
        title: "Account",
        items: [
            {
                id: "account",
                title: "Profile & Settings",
                path: "/dashboard/admin/account",
                icon: faUserGear,
                description:
                    "Admin profile, password management, and relevant account settings.",
                activeMatch: adminMatch("/dashboard/admin/account"),
            },
        ],
    },
];

export const findAdminItem = (id) =>
    adminSidebarGroups.flatMap((g) => g.items).find((i) => i.id === id);