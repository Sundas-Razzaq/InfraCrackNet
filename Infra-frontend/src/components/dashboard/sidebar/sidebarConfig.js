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
    },
    {
        id: "projects",
        title: "Projects",
        path: "/dashboard/projects",
        icon: faFolderOpen,
    },
    {
        id: "new-inspection",
        title: "Inspection",
        path: "/dashboard/inspection",
        icon: faClipboardCheck,
    },
    {
        id: "analytics",
        title: "Analytics",
        path: "/dashboard/analytics",
        icon: faChartLine,
    },
    {
        id: "reports",
        title: "Reports",
        path: "/dashboard/reports",
        icon: faFileLines,
    },
    {
        id: "team",
        title: "Team Management",
        path: "/dashboard/team",
        icon: faUsers,
    },
    {
        id: "history",
        title: "History",
        path: "/dashboard/inspection-history",
        icon: faClock,
    },
    {
        id: "notifications",
        title: "Notifications",
        path: "/dashboard/notifications",
        icon: faBell,
    },
    {
        id: "profile",
        title: "Profile",
        path: "/dashboard/profile",
        icon: faUser,
    },
    {
        id: "settings",
        title: "Settings",
        path: "/dashboard/settings",
        icon: faGear,
    },
];