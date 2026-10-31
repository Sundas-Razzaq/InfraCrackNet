const Project = require("../models/project");
const Team = require("../models/team");

const generateProjectCode = require("../utils/projectCodeGenerator");
const { logActivity } = require("../services/activityLogService");
const {
    getAssignableTeam,
    getTeamInspectors,
    hasRunningAnalysis,
    getProjectFootprint,
    notifyTeamMembers,
    deleteProjectCascade,
} = require("../services/projectService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");

const TEAM_POPULATE = {
    path: "team",
    select: "name status engineerLead",
    populate: { path: "engineerLead", select: "name email" },
};

const SORTS = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    name: { name: 1, _id: 1 },
};

const EDITABLE_FIELDS = [
    "name",
    "description",
    "structureType",
    "location",
    "priority",
    "status",
];

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sendServiceError = (res, error) =>
    res.status(error.status).json({
        success: false,
        message: error.message,
    });

const notFound = (res) =>
    res.status(404).json({
        success: false,
        message: "Project not found.",
    });

const RUNNING_MESSAGE =
    "This project has an AI analysis that is still queued or processing. Wait for it to finish or cancel it first.";

/* POST /api/admin/projects */
const createAdminProject = async (req, res, next) => {
    try {
        const {
            name,
            description,
            structureType,
            location,
            priority,
            status,
            teamId,
        } = req.body;

        let team = null;

        if (teamId) {
            const result = await getAssignableTeam(teamId);
            if (result.error) return sendServiceError(res, result.error);
            team = result.team;
        }

        const projectCode = await generateProjectCode();

        const project = await Project.create({
            projectCode,
            name,
            description,
            structureType,
            location,
            priority,
            status,
            createdBy: req.user.id,
            ...(team && {
                team: team._id,
                assignedAt: new Date(),
                assignedBy: req.user.id,
            }),
        });

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.PROJECT_CREATED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: project.projectCode,
            metadata: {
                name: project.name,
                assigned: Boolean(team),
            },
        });

        if (team) {
            await logActivity({
                actor: req.user,
                action: ACTIVITY_ACTIONS.PROJECT_ASSIGNED,
                targetType: "Project",
                targetId: project._id,
                targetLabel: project.projectCode,
                changes: {
                    before: { team: null },
                    after: { team: team._id, teamName: team.name },
                },
            });

            await notifyTeamMembers(team._id, {
                title: "Project assigned",
                message: `Project ${project.projectCode} (${project.name}) has been assigned to your team "${team.name}".`,
                projectId: project._id,
            });
        }

        await project.populate(TEAM_POPULATE);

        res.status(201).json({
            success: true,
            message: team
                ? "Project created and assigned to the team."
                : "Project created as Unassigned. Assign a team to start the workflow.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/projects */
const listAdminProjects = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            status,
            structureType,
            priority,
            teamId,
            assignment,
            sort,
        } = req.validatedQuery;

        const filter = {};

        if (status) filter.status = status;
        if (structureType) filter.structureType = structureType;
        if (priority) filter.priority = priority;

        if (teamId) {
            filter.team = teamId;
        } else if (assignment === "assigned") {
            filter.team = { $ne: null };
        } else if (assignment === "unassigned") {
            filter.team = null;
        }

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [
                { name: regex },
                { projectCode: regex },
                { location: regex },
            ];
        }

        const [projects, total] = await Promise.all([
            Project.find(filter)
                .populate(TEAM_POPULATE)
                .populate("createdBy", "name email")
                .sort(SORTS[sort])
                .skip((page - 1) * limit)
                .limit(limit),
            Project.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/projects/:id */
const getAdminProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate(TEAM_POPULATE)
            .populate("createdBy", "name email")
            .populate("assignedBy", "name email");

        if (!project) return notFound(res);

        const [footprint, teamInspectors] = await Promise.all([
            getProjectFootprint(project._id),
            getTeamInspectors(project.team?._id),
        ]);

        res.status(200).json({
            success: true,
            data: project,
            footprint,
            teamInspectors,
        });
    } catch (error) {
        next(error);
    }
};

/* PATCH /api/admin/projects/:id */
const updateAdminProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return notFound(res);

        const update = {};
        const before = {};
        const after = {};

        EDITABLE_FIELDS.forEach((field) => {
            if (
                req.body[field] !== undefined &&
                req.body[field] !== project[field]
            ) {
                update[field] = req.body[field];
                before[field] = project[field];
                after[field] = req.body[field];
            }
        });

        if (Object.keys(update).length === 0) {
            return res.status(200).json({
                success: true,
                message: "No changes to apply.",
                data: project,
            });
        }

        const updated = await Project.findByIdAndUpdate(project._id, update, {
            returnDocument: "after",
            runValidators: true,
        }).populate(TEAM_POPULATE);

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.PROJECT_UPDATED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: project.projectCode,
            changes: { before, after },
        });

        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* PUT /api/admin/projects/:id/team  (assign or reassign) */
const assignProjectTeam = async (req, res, next) => {
    try {
        const { teamId } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) return notFound(res);

        const previousTeamId = project.team || null;

        if (previousTeamId && String(previousTeamId) === teamId) {
            return res.status(409).json({
                success: false,
                message: "This project is already assigned to that team.",
            });
        }

        const { team, error } = await getAssignableTeam(teamId);

        if (error) return sendServiceError(res, error);

        // Moving a project away from a team that is mid-analysis is unsafe.
        if (previousTeamId && (await hasRunningAnalysis(project._id))) {
            return res.status(409).json({
                success: false,
                message: RUNNING_MESSAGE,
            });
        }

        // Only change if the team is still what we just read.
        const updated = await Project.findOneAndUpdate(
            { _id: project._id, team: previousTeamId },
            {
                team: team._id,
                assignedAt: new Date(),
                assignedBy: req.user.id,
            },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(409).json({
                success: false,
                message: "The project was changed by someone else. Please retry.",
            });
        }

        const previousTeam = previousTeamId
            ? await Team.findById(previousTeamId).select("name")
            : null;

        await logActivity({
            actor: req.user,
            action: previousTeamId
                ? ACTIVITY_ACTIONS.PROJECT_REASSIGNED
                : ACTIVITY_ACTIONS.PROJECT_ASSIGNED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: project.projectCode,
            changes: {
                before: {
                    team: previousTeamId,
                    teamName: previousTeam?.name || null,
                },
                after: { team: team._id, teamName: team.name },
            },
        });

        await notifyTeamMembers(team._id, {
            title: "Project assigned",
            message: `Project ${project.projectCode} (${project.name}) has been assigned to your team "${team.name}".`,
            projectId: project._id,
        });

        if (previousTeamId) {
            await notifyTeamMembers(previousTeamId, {
                title: "Project reassigned",
                message: `Project ${project.projectCode} (${project.name}) is no longer assigned to your team.`,
                projectId: project._id,
            });
        }

        await updated.populate(TEAM_POPULATE);

        res.status(200).json({
            success: true,
            message: previousTeamId
                ? "Project reassigned successfully."
                : "Project assigned successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* DELETE /api/admin/projects/:id/team  (unassign) */
const unassignProjectTeam = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return notFound(res);

        if (!project.team) {
            return res.status(409).json({
                success: false,
                message: "This project is already unassigned.",
            });
        }

        if (await hasRunningAnalysis(project._id)) {
            return res.status(409).json({
                success: false,
                message: RUNNING_MESSAGE,
            });
        }

        const previousTeamId = project.team;

        const updated = await Project.findOneAndUpdate(
            { _id: project._id, team: previousTeamId },
            { team: null, assignedAt: null, assignedBy: null },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(409).json({
                success: false,
                message: "The project was changed by someone else. Please retry.",
            });
        }

        const previousTeam = await Team.findById(previousTeamId).select("name");

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.PROJECT_UNASSIGNED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: project.projectCode,
            changes: {
                before: {
                    team: previousTeamId,
                    teamName: previousTeam?.name || null,
                },
                after: { team: null },
            },
        });

        await notifyTeamMembers(previousTeamId, {
            title: "Project unassigned",
            message: `Project ${project.projectCode} (${project.name}) is no longer assigned to your team.`,
            projectId: project._id,
        });

        res.status(200).json({
            success: true,
            message: "Project unassigned. It is now outside the team workflow.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* DELETE /api/admin/projects/:id?confirm=<projectCode> */
const deleteAdminProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return notFound(res);

        if (req.validatedQuery.confirm !== project.projectCode) {
            return res.status(400).json({
                success: false,
                message: `Confirmation does not match. Use ?confirm=${project.projectCode} to delete this project.`,
            });
        }

        if (await hasRunningAnalysis(project._id)) {
            return res.status(409).json({
                success: false,
                message: RUNNING_MESSAGE,
            });
        }

        const teamId = project.team;
        const { projectCode, name } = project;

        const { counts, failedPublicIds } = await deleteProjectCascade(project);

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.PROJECT_DELETED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: projectCode,
            metadata: {
                name,
                deleted: counts,
                cloudinaryFailures: failedPublicIds,
            },
        });

        await notifyTeamMembers(teamId, {
            title: "Project deleted",
            message: `Project ${projectCode} (${name}) was deleted by the administrator.`,
        });

        res.status(200).json({
            success: true,
            message: "Project and all its records were deleted.",
            deleted: counts,
            cloudinaryFailures: failedPublicIds,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAdminProject,
    listAdminProjects,
    getAdminProject,
    updateAdminProject,
    assignProjectTeam,
    unassignProjectTeam,
    deleteAdminProject,
};