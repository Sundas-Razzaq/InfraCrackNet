const mongoose = require("mongoose");

const Report = require("../models/report");
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Inspection = require("../models/inspection");
const fs = require("fs");
const path = require("path");

const generateReportCode = require("../utils/reportCodeGenerator");
const generateRecommendations = require("../utils/recommendationGenerator");
const generateReportPDF = require("../utils/reportGenerator");

const generateReport = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(analysisId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        const analysis = await AIAnalysis.findById(analysisId)
            .populate({
                path: "inspection",
                populate: {
                    path: "project",
                },
            });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "AI analysis has not completed.",
            });
        }

        if (
            !["Validated", "Report Generated"].includes(
                analysis.inspection.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Annotation review must be completed before generating the report.",
            });
        }

        const existingReport = await Report.findOne({
            analysis: analysisId,
        });

        if (existingReport) {
            return res.status(409).json({
                success: false,
                message:
                    "A report already exists for this analysis.",
            });
        }

        // Generate report code
        const reportCode = await generateReportCode();

        // Generate recommendations
        const recommendations = generateRecommendations(
            analysis.overallSeverity,
            analysis.riskScore
        );

        // Generate PDF and upload to Cloudinary
        const pdf = await generateReportPDF({
            reportCode,
            projectName: analysis.inspection.project.name,
            inspectionCode:
                analysis.inspection.inspectionCode,
            analysisCode: analysis.analysisCode,
            overallSeverity:
                analysis.overallSeverity,
            riskScore: analysis.riskScore,
            averageConfidence:
                analysis.averageConfidence,
            recommendations,
        });

        // Create report document
        const report = await Report.create({
            reportCode,

            inspection:
                analysis.inspection._id,

            analysis:
                analysis._id,

            generatedBy:
                req.user.id,

            reportUrl:
                pdf.reportUrl,

            fileName:
                pdf.fileName,

            recommendations,
        });

        // Update inspection status
        analysis.inspection.status =
            "Report Generated";

        await analysis.inspection.save();

        return res.status(201).json({
            success: true,
            message:
                "Report generated successfully.",
            data: report,
        });
    } catch (error) {
        next(error);
    }
};


const getReport = async (req, res, next) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID.",
            });
        }

        const report = await Report.findById(reportId)
            .populate({
                path: "inspection",
                populate: {
                    path: "project",
                },
            })
            .populate("analysis")
            .populate("generatedBy", "name email");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        const cracks = await CrackDetection.find({
            analysis: report.analysis._id,
            validationStatus: {
                $ne: "Removed",
            },
        }).populate(
            "inspectionImage",
            "imageUrl originalFileName"
        );

        return res.status(200).json({
            success: true,
            data: {
                report,
                cracks,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate({
                path: "inspection",
                select: "inspectionCode structureArea",
                populate: {
                    path: "project",
                    select: "projectCode name structureType",
                },
            })
            .populate(
                "analysis",
                "analysisCode overallSeverity riskScore averageConfidence"
            )
            .populate(
                "generatedBy",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        next(error);
    }
};

const downloadReport = async (req, res, next) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID.",
            });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        if (!report.reportUrl) {
            return res.status(404).json({
                success: false,
                message: "PDF not available.",
            });
        }

        return res.redirect(report.reportUrl);

    } catch (error) {
        next(error);
    }
};


module.exports = {
    generateReport,
    getReport,
    downloadReport,
    getAllReports,
};