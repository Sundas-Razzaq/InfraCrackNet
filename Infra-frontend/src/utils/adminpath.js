// Role-aware paths so Admin reuses the shared Profile/Notifications pages.
export const profilePath = (role) =>
    role === "Admin" ? "/dashboard/admin/account" : "/dashboard/profile";

export const notificationsPath = (role) =>
    role === "Admin"
        ? "/dashboard/admin/notifications"
        : "/dashboard/notifications";

// Admin page for a notification's related entity, or null.
export const adminNotificationTarget = (entity, id) => {
    switch (entity) {
        case "Invitation":
            return "/dashboard/admin/users?tab=invitations";
        case "Team":
            return id ? `/dashboard/admin/teams/${id}` : null;
        case "Project":
            return id ? `/dashboard/admin/projects/${id}` : null;
        case "Inspection":
            return id ? `/dashboard/admin/inspections/${id}` : null;
        case "Analysis":
            return id ? `/dashboard/admin/analyses/${id}` : null;
        case "Report":
            return id ? `/dashboard/admin/reports/${id}` : null;
        default:
            return null;
    }
};