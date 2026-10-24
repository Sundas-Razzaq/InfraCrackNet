const mongoose = require("mongoose");

const Project = require("../models/project");
const { getProjectScope } = require("../utils/projectAccess");
const { logActivity } = require("../services/activityLogService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");

const TEAM_POPULATE = {
    path: "team",
    select: "name status engineerLead",
    populate: { path: "engineerLead", select: "name email" },
};

/* Get All Projects (apni team ke; Admin sab) */
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find(getProjectScope(req.user))
            .populate("createdBy", "name email role")
            .populate(TEAM_POPULATE)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
};

/* Get Single Project */
const getProjectById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            ...getProjectScope(req.user),
        })
            .populate("createdBy", "name email role")
            .populate(TEAM_POPULATE);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

/* Update Project details (Engineer, sirf apni team ka project; team change nahi) */
const updateProject = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const before = await Project.findOne({
            _id: req.params.id,
            ...getProjectScope(req.user),
        });

        if (!before) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const allowedFields = [
            "name",
            "description",
            "structureType",
            "location",
            "priority",
            "status",
        ];

        const updateData = {};
        const changes = {};

        allowedFields.forEach((field) => {
            if (
                req.body[field] !== undefined &&
                req.body[field] !== before[field]
            ) {
                updateData[field] = req.body[field];
                changes[field] = { from: before[field], to: req.body[field] };
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(200).json({
                success: true,
                message: "No changes to apply.",
                data: before,
            });
        }

        const project = await Project.findOneAndUpdate(
            { _id: before._id },
            updateData,
            { returnDocument: "after", runValidators: true }
        );

        await logActivity({
            actor: req.user,
            action: ACTIVITY_ACTIONS.PROJECT_UPDATED,
            targetType: "Project",
            targetId: project._id,
            targetLabel: project.projectCode,
            metadata: { changes },
        });

        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProjects, getProjectById, updateProject };