import Project from "../models/Project.js";
import generateProjectCode from "../utils/projectCodeGenerator.js";
/**
 * Create Project
 */
export const createProject = async (req, res, next) => {
    try {
        const projectCode = await generateProjectCode();

        const project = await Project.create({
            ...req.body,
            projectCode,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get All Projects
 */
export const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find()
            .populate("createdBy", "name email role")
            .populate("assignedEngineers", "name email")
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

/**
 * Get Single Project
 */
export const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email role")
            .populate("assignedEngineers", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Project
 */
export const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Project
 */
export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};