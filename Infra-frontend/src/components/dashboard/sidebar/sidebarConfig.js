import {
    faBell,
    faChartLine,
    faCirclePlus,
    faClock,
    faFolderOpen,
    faGaugeHigh,
    faGear,
    faFileLines,
    faUser,
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
        title: "New Inspection",
        path: "/dashboard/upload-inspection",
        icon: faCirclePlus,
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
