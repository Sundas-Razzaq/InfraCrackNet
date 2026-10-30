// Mirrors the backend activity actions; used for labels, filters and links.
export const ACTIVITY_ACTION_GROUPS = [
    {
        label: "Invitations",
        actions: [
            ["invitation.created", "Invitation sent"],
            ["invitation.accepted", "Invitation accepted"],
            ["invitation.rejected", "Invitation rejected"],
            ["invitation.expired", "Invitation expired"],
            ["invitation.resent", "Invitation resent"],
        ],
    },
    {
        label: "Users",
        actions: [
            ["user.role_changed", "User role changed"],
            ["user.status_changed", "User status changed"],
        ],
    },
    {
        label: "Teams",
        actions: [
            ["team.created", "Team created"],
            ["team.updated", "Team updated"],
            ["team.activated", "Team activated"],
            ["team.deactivated", "Team deactivated"],
            ["team.lead_assigned", "Team lead assigned"],
            ["team.lead_replaced", "Team lead replaced"],
            ["team.member_added", "Team member added"],
            ["team.member_removed", "Team member removed"],
        ],
    },
    {
        label: "Projects",
        actions: [
            ["project.created", "Project created"],
            ["project.updated", "Project updated"],
            ["project.assigned", "Project assigned"],
            ["project.reassigned", "Project reassigned"],
            ["project.unassigned", "Project unassigned"],
            ["project.deleted", "Project deleted"],
        ],
    },
    {
        label: "Inspections",
        actions: [
            ["inspection.created", "Inspection created"],
            ["inspection.status_changed", "Inspection status changed"],
        ],
    },
    {
        label: "Analyses",
        actions: [
            ["analysis.started", "Analysis started"],
            ["analysis.completed", "Analysis completed"],
            ["analysis.failed", "Analysis failed"],
            ["analysis.cancelled", "Analysis cancelled"],
        ],
    },
    {
        label: "Reports",
        actions: [["report.generated", "Report generated"]],
    },
];

export const ACTIVITY_TARGET_TYPES = [
    "User",
    "Invitation",
    "Team",
    "Project",
    "Inspection",
    "Analysis",
    "Report",
    "System",
];

const LABELS = Object.fromEntries(ACTIVITY_ACTION_GROUPS.flatMap((group) => group.actions));

export const actionLabel = (action = "") =>
    LABELS[action] || action.replace(/[._]/g, " ");

const TARGET_ROUTES = {
    Project: "projects",
    Team: "teams",
    Inspection: "inspections",
    Analysis: "analyses",
    Report: "reports",
};

// Admin page for the entry's target, or null (no page / target was deleted).
export const activityTargetPath = (entry) => {
    const base = TARGET_ROUTES[entry.targetType];

    if (!base || !entry.targetId || entry.action === "project.deleted") return null;

    return `/dashboard/admin/${base}/${entry.targetId}`;
};