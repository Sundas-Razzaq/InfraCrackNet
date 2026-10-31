const Team = require("../models/team");
const User = require("../models/user");
const Project = require("../models/project");
const { logActivity } = require("../services/activityLogService");
const { notifySafely } = require("../services/invitationService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");
const { getTeamInspectors } = require("../services/projectService");
const {
    countRunningAnalyses,
    getMemberImpact: buildMemberImpact,
} = require("../services/teamImpactService");

const RECOMMENDED_MIN =
    Number(process.env.TEAM_RECOMMENDED_MIN_INSPECTORS) || 2;
const RECOMMENDED_MAX =
    Number(process.env.TEAM_RECOMMENDED_MAX_INSPECTORS) || 3;

const NAME_COLLATION = { locale: "en", strength: 2 };

const SORTS = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    name: { name: 1, _id: 1 },
};

const LEAD_FIELDS = "name email role isActive";

/* helpers */

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isEligibleLead = (user) =>
    Boolean(user) && user.role === "Engineer" && user.isActive !== false;

const countInspectors = (teamId) =>
    User.countDocuments({ team: teamId, role: "Inspector" });

const getSizeWarnings = (inspectorCount) => {
    if (inspectorCount < RECOMMENDED_MIN || inspectorCount > RECOMMENDED_MAX) {
        return [
            `Recommended team size is ${RECOMMENDED_MIN}-${RECOMMENDED_MAX} inspectors (currently ${inspectorCount}).`,
        ];
    }
    return [];
};

const buildReadiness = (lead, inspectorCount) => {
    const missing = [];

    if (!lead) {
        missing.push("Engineer lead");
    } else if (!isEligibleLead(lead)) {
        missing.push("Eligible Engineer lead (the current lead is inactive)");
    }

    return {
        canActivate: missing.length === 0,
        missing,
        warnings: getSizeWarnings(inspectorCount),
    };
};

/* TEAMS */

/* POST /api/admin/teams */
const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const duplicate = await Team.findOne({ name }).collation(
            NAME_COLLATION
        );

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "A team with this name already exists.",
            });
        }

        let team;

        try {
            team = await Team.create({
                name,
                description,
                createdBy: req.user.id,
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "A team with this name already exists.",
                });
            }
            throw error;
        }

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.TEAM_CREATED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: team.name,
        });

        res.status(201).json({
            success: true,
            message:
                "Team created. Assign an Engineer lead, then activate it.",
            data: team,
        });
    } catch (error) {
        next(error);
    }
};

/* GET /api/admin/teams */
const listTeams = async (req, res, next) => {
    try {
        const { page, limit, search, status, hasLead, sort } =
            req.validatedQuery;

        const filter = {};

        if (status) filter.status = status;
        if (hasLead === true) filter.engineerLead = { $ne: null };
        if (hasLead === false) filter.engineerLead = null;
        if (search) {
            filter.name = {
                $regex: escapeRegex(search),
                $options: "i",
            };
        }

        const [teams, total] = await Promise.all([
            Team.find(filter)
                .populate("engineerLead", LEAD_FIELDS)
                .sort(SORTS[sort])
                .skip((page - 1) * limit)
                .limit(limit),
            Team.countDocuments(filter),
        ]);

        const counts = await User.aggregate([
            { $match: { team: { $in: teams.map((team) => team._id) } } },
            {
                $group: {
                    _id: "$team",
                    total: { $sum: 1 },
                    inspectors: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "Inspector"] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        const countByTeam = new Map(
            counts.map((row) => [String(row._id), row])
        );

        const data = teams.map((team) => {
            const row = countByTeam.get(String(team._id));
            return {
                ...team.toObject(),
                memberCounts: {
                    inspectors: row?.inspectors || 0,
                    total: row?.total || 0,
                },
            };
        });

        res.status(200).json({
            success: true,
            data,
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

/* GET /api/admin/teams/:id */
const getTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id).populate(
            "engineerLead",
            LEAD_FIELDS
        );

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        const inspectors = await User.find({
            team: team._id,
            role: "Inspector",
        })
            .select("name email isActive")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: team,
            inspectors,
            readiness: buildReadiness(team.engineerLead, inspectors.length),
        });
    } catch (error) {
        next(error);
    }
};

/* PATCH /api/admin/teams/:id */
const updateTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        const { name, description } = req.body;
        const update = {};
        const before = {};
        const after = {};

        if (name !== undefined && name !== team.name) {
            const duplicate = await Team.findOne({
                name,
                _id: { $ne: team._id },
            }).collation(NAME_COLLATION);

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "A team with this name already exists.",
                });
            }

            update.name = name;
            before.name = team.name;
            after.name = name;
        }

        if (description !== undefined && description !== team.description) {
            update.description = description;
            before.description = team.description;
            after.description = description;
        }

        if (Object.keys(update).length === 0) {
            return res.status(200).json({
                success: true,
                message: "No changes to apply.",
                data: team,
            });
        }

        let updated;

        try {
            updated = await Team.findByIdAndUpdate(team._id, update, {
                returnDocument: "after",
                runValidators: true,
            }).populate("engineerLead", LEAD_FIELDS);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "A team with this name already exists.",
                });
            }
            throw error;
        }

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.TEAM_UPDATED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: updated.name,
            changes: { before, after },
        });

        res.status(200).json({
            success: true,
            message: "Team updated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* PATCH /api/admin/teams/:id/status */
const updateTeamStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        if (team.status === status) {
            return res.status(409).json({
                success: false,
                message: `Team is already ${status.toLowerCase()}.`,
            });
        }
        if (status === "Inactive") {
            const openProjects = await Project.countDocuments({
                team: team._id,
                status: { $ne: "Completed" },
            });

            if (openProjects > 0) {
                return res.status(409).json({
                    success: false,
                    message: `This team still has ${openProjects} open project(s). Reassign or complete them before deactivating the team.`,
                    openProjects,
                });
            }
        }
        if (status === "Active") {
            const lead = team.engineerLead
                ? await User.findById(team.engineerLead).select(
                    "role isActive"
                )
                : null;

            const inspectorCount = await countInspectors(team._id);
            const readiness = buildReadiness(lead, inspectorCount);

            if (!readiness.canActivate) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This team cannot be activated yet. It needs an eligible Engineer lead.",
                    readiness,
                });
            }
        }

        // Only change if the status is still what we read (no double toggles).
        const updated = await Team.findOneAndUpdate(
            { _id: team._id, status: team.status },
            { status },
            { returnDocument: "after" }
        ).populate("engineerLead", LEAD_FIELDS);

        if (!updated) {
            return res.status(409).json({
                success: false,
                message: "The team was changed by someone else. Please retry.",
            });
        }

        await logActivity({
            actor: req.user,
            action:
                status === "Active"
                    ? ACTIVITY_ACTIONS.TEAM_ACTIVATED
                    : ACTIVITY_ACTIONS.TEAM_DEACTIVATED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: team.name,
            changes: {
                before: { status: team.status },
                after: { status },
            },
        });

        res.status(200).json({
            success: true,
            message:
                status === "Active"
                    ? "Team activated successfully."
                    : "Team deactivated successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/* LEAD */

/* PUT /api/admin/teams/:id/lead */
const setTeamLead = async (req, res, next) => {
    try {
        const { engineerId } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        if (team.engineerLead && String(team.engineerLead) === engineerId) {
            return res.status(409).json({
                success: false,
                message: "This Engineer is already the team lead.",
            });
        }

        // Lead badalna theek hai, lekin analysis chalte waqt nahi.
        if (team.engineerLead) {
            const running = await countRunningAnalyses(team._id);

            if (running > 0) {
                return res.status(409).json({
                    success: false,
                    message: `Cannot replace the lead while ${running} analysis is running. Try again after it finishes.`,
                    runningAnalyses: running,
                });
            }
        }

        const engineer = await User.findById(engineerId).select(
            LEAD_FIELDS + " team"
        );

        if (!engineer) {
            return res.status(404).json({
                success: false,
                message: "Engineer not found.",
            });
        }

        if (!isEligibleLead(engineer)) {
            return res.status(400).json({
                success: false,
                message:
                    "Only an active Engineer can be assigned as team lead.",
            });
        }

        // Atomic claim: succeeds only if the Engineer has no team yet.
        const claimed = await User.findOneAndUpdate(
            {
                _id: engineer._id,
                role: "Engineer",
                isActive: { $ne: false },
                team: null,
            },
            { team: team._id },
            { returnDocument: "after" }
        );

        if (!claimed) {
            return res.status(409).json({
                success: false,
                message: "This Engineer already belongs to another team.",
            });
        }

        const previousLeadId = team.engineerLead || null;

        const updated = await Team.findOneAndUpdate(
            { _id: team._id, engineerLead: previousLeadId },
            { engineerLead: engineer._id },
            { returnDocument: "after" }
        ).populate("engineerLead", LEAD_FIELDS);

        if (!updated) {
            // Someone changed the team meanwhile: undo our claim.
            await User.updateOne(
                { _id: engineer._id, team: team._id },
                { team: null }
            );

            return res.status(409).json({
                success: false,
                message: "The team was changed by someone else. Please retry.",
            });
        }

        // Free the previous lead (only possible on an inactive team).
        if (previousLeadId) {
            await User.updateOne(
                { _id: previousLeadId, team: team._id },
                { team: null }
            );
        }

        await logActivity({
            actor: req.user,
            action: previousLeadId
                ? ACTIVITY_ACTIONS.TEAM_LEAD_REPLACED
                : ACTIVITY_ACTIONS.TEAM_LEAD_ASSIGNED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: team.name,
            changes: {
                before: { engineerLead: previousLeadId },
                after: { engineerLead: engineer._id },
            },
            metadata: { leadEmail: engineer.email },
        });
        if (previousLeadId) {
            await notifySafely({
                recipient: previousLeadId,
                type: "team",
                title: "Team lead changed",
                message: `You are no longer the Engineer lead of team "${team.name}".`,
                relatedEntity: "Team",
                relatedEntityId: team._id,
            });
        }
        res.status(200).json({
            success: true,
            message: previousLeadId
                ? "Team lead replaced successfully."
                : "Team lead assigned successfully.",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

/*MEMBERS (Inspectors) */

/* POST /api/admin/teams/:id/members */
const addTeamMember = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        const user = await User.findById(userId).select(
            "name email role isActive team"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.role !== "Inspector") {
            return res.status(400).json({
                success: false,
                message:
                    "Only Inspectors can be added as members. An Engineer joins a team as its lead.",
            });
        }

        if (user.isActive === false) {
            return res.status(409).json({
                success: false,
                message: "This user's account is deactivated.",
            });
        }

        if (user.team) {
            return res.status(409).json({
                success: false,
                message:
                    String(user.team) === String(team._id)
                        ? "This Inspector is already a member of this team."
                        : "This Inspector already belongs to another team.",
            });
        }

        // Atomic claim: only one team can win, even with simultaneous requests.
        const claimed = await User.findOneAndUpdate(
            {
                _id: user._id,
                role: "Inspector",
                isActive: { $ne: false },
                team: null,
            },
            { team: team._id },
            { returnDocument: "after" }
        ).select("name email role team");

        if (!claimed) {
            return res.status(409).json({
                success: false,
                message: "This Inspector already belongs to another team.",
            });
        }

        const inspectorCount = await countInspectors(team._id);

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.TEAM_MEMBER_ADDED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: team.name,
            metadata: {
                memberId: user._id,
                memberEmail: user.email,
                inspectorCount,
            },
        });

        await notifySafely({
            recipient: user._id,
            type: "team",
            title: "Added to a team",
            message: `You have been added to team "${team.name}".`,
            relatedEntity: "Team",
            relatedEntityId: team._id,
        });

        res.status(200).json({
            success: true,
            message: "Inspector added to the team.",
            data: claimed,
            inspectorCount,
            warnings: getSizeWarnings(inspectorCount),
        });
    } catch (error) {
        next(error);
    }
};

/* DELETE /api/admin/teams/:id/members/:userId */
const removeTeamMember = async (req, res, next) => {
    try {
        const { id, userId } = req.params;

        const team = await Team.findById(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        if (team.engineerLead && String(team.engineerLead) === userId) {
            return res.status(409).json({
                success: false,
                message:
                    "The team lead cannot be removed here. Replace the lead through the membership change workflow.",
            });
        }
        const running = await countRunningAnalyses(team._id, userId);

        if (running > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot remove this Inspector while ${running} analysis on their inspections is running.`,
                runningAnalyses: running,
            });
        }
        const removed = await User.findOneAndUpdate(
            { _id: userId, team: team._id, role: "Inspector" },
            { team: null },
            { returnDocument: "before" }
        ).select("name email");

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "This user is not an Inspector member of the team.",
            });
        }

        const inspectorCount = await countInspectors(team._id);

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.TEAM_MEMBER_REMOVED,
            targetType: "Team",
            targetId: team._id,
            targetLabel: team.name,
            metadata: {
                memberId: removed._id,
                memberEmail: removed.email,
                inspectorCount,
            },
        });

        await notifySafely({
            recipient: removed._id,
            type: "team",
            title: "Removed from a team",
            message: `You have been removed from team "${team.name}".`,
            relatedEntity: "Team",
            relatedEntityId: team._id,
        });

        res.status(200).json({
            success: true,
            message: "Inspector removed from the team.",
            inspectorCount,
            warnings: getSizeWarnings(inspectorCount),
        });
    } catch (error) {
        next(error);
    }
};

/*AVAILABLE USERS */

/* GET /api/admin/teams/available-members */
const listAvailableMembers = async (req, res, next) => {
    try {
        const { page, limit, role, search } = req.validatedQuery;

        const filter = {
            role,
            isActive: { $ne: false },
            team: null,
        };

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [{ name: regex }, { email: regex }];
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("name email role")
                .sort({ name: 1, _id: 1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: users,
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

/* GET /api/admin/teams/:id/members/:userId/impact */
const getMemberImpact = async (req, res, next) => {
    try {
        const { id, userId } = req.params;

        const team = await Team.findById(id).select(
            "name status engineerLead"
        );

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found.",
            });
        }

        const member = await User.findOne({
            _id: userId,
            team: team._id,
        }).select("name email role isActive");

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "This user is not a member of the team.",
            });
        }

        const impact = await buildMemberImpact(team, member);

        res.status(200).json({
            success: true,
            data: {
                team: { _id: team._id, name: team.name, status: team.status },
                member,
                ...impact,
            },
        });
    } catch (error) {
        next(error);
    }
};
/* GET /api/teams/my  (Engineer, Inspector)
   Always the caller's OWN team, taken from the logged-in user. */
const getMyTeam = async (req, res, next) => {
    try {
        const empty = { success: true, data: null, inspectors: [], projects: null };

        if (!req.user.team) return res.status(200).json(empty);

        const team = await Team.findById(req.user.team)
            .select("name description status engineerLead createdAt")
            .populate("engineerLead", LEAD_FIELDS);

        if (!team) return res.status(200).json(empty);

        const [inspectors, grouped] = await Promise.all([
            getTeamInspectors(team._id),
            Project.aggregate([
                { $match: { team: team._id } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
        ]);

        const projects = { total: 0, active: 0, onHold: 0, completed: 0 };

        grouped.forEach(({ _id, count }) => {
            projects.total += count;
            if (_id === "Active") projects.active = count;
            else if (_id === "On Hold") projects.onHold = count;
            else if (_id === "Completed") projects.completed = count;
        });

        res.status(200).json({ success: true, data: team, inspectors, projects });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createTeam,
    listTeams,
    getTeam,
    updateTeam,
    updateTeamStatus,
    setTeamLead,
    addTeamMember,
    removeTeamMember,
    listAvailableMembers,
    getMemberImpact,
    getMyTeam,
};