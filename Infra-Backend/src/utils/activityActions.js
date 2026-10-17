const ACTIVITY_ACTIONS = {
    // Invitations
    INVITATION_CREATED: "invitation.created",
    INVITATION_ACCEPTED: "invitation.accepted",
    INVITATION_REJECTED: "invitation.rejected",
    INVITATION_EXPIRED: "invitation.expired",
    INVITATION_RESENT: "invitation.resent",

    // Users
    USER_ROLE_CHANGED: "user.role_changed",
    USER_STATUS_CHANGED: "user.status_changed",

    // Teams
    TEAM_CREATED: "team.created",
    TEAM_DEACTIVATED: "team.deactivated",
    TEAM_LEAD_ASSIGNED: "team.lead_assigned",
    TEAM_LEAD_REPLACED: "team.lead_replaced",
    TEAM_MEMBER_ADDED: "team.member_added",
    TEAM_MEMBER_REMOVED: "team.member_removed",

    // Projects
    PROJECT_CREATED: "project.created",
    PROJECT_ASSIGNED: "project.assigned",
    PROJECT_UNASSIGNED: "project.unassigned",
    PROJECT_REASSIGNED: "project.reassigned",

    // Inspections
    INSPECTION_CREATED: "inspection.created",
    INSPECTION_STATUS_CHANGED: "inspection.status_changed",

    // Analyses
    ANALYSIS_STARTED: "analysis.started",
    ANALYSIS_COMPLETED: "analysis.completed",
    ANALYSIS_FAILED: "analysis.failed",
    ANALYSIS_CANCELLED: "analysis.cancelled",

    // Reports
    REPORT_GENERATED: "report.generated",
};

const ACTIVITY_ACTION_VALUES = Object.values(ACTIVITY_ACTIONS);

const ACTIVITY_TARGET_TYPES = [
    "User",
    "Invitation",
    "Team",
    "Project",
    "Inspection",
    "Analysis",
    "Report",
    "System",
];

module.exports = {
    ACTIVITY_ACTIONS,
    ACTIVITY_ACTION_VALUES,
    ACTIVITY_TARGET_TYPES,
};