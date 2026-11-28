// src/services/realAnalysisService.js
const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const { createNotification } = require("./notificationService");
const { logActivity } = require("./activityLogService");
const { ACTIVITY_ACTIONS } = require("../utils/activityActions");
const { notifyAdmins } = require("./adminNotificationService");
const { analyzeImage } = require("./mlClient");

// Asli models sirf Low / Medium / High dete hain ("Critical" nahi).
const SEVERITY_RANK = { Low: 1, Medium: 2, High: 3, Critical: 4 };
const RISK_SCORES = { Low: 25, Medium: 50, High: 75, Critical: 95 };

const startRealAnalysis = async (analysisId) => {
    try {
        const analysis = await AIAnalysis.findById(analysisId);
        if (!analysis) return;

        analysis.status = "Processing";
        analysis.startedAt = new Date();
        analysis.currentStep = "Preparing images";
        analysis.progress = 5;
        await analysis.save();

        const images = await InspectionImage.find({ inspection: analysis.inspection });
        const totalImages = images.length;

        let crackCounter = 1;
        let totalConfidence = 0;
        let totalCracks = 0;
        let highest = null;

        analysis.currentStep = "Running crack detection";
        await analysis.save();

        const imageResults = [];

        for (let i = 0; i < totalImages; i++) {
            const image = images[i];

            // sequential: ML service ek waqt mein ek image karti hai
            // (analyzeImage already returns a normalised, complete object)
            const result = await analyzeImage(image.imageUrl);
            const [imageWidth, imageHeight] = result.image_size;
            const imageSeverity = result.severity || null;

            const notes = [
                `Model 1: ${result.presence.label} (P(cracked)=${result.presence.p_cracked}).`,
                ...(result.notes || []),
            ].join(" ").slice(0, 1000);

            // image-level result (presence, crack_count, severity, metrics, ...)
            const m = result.severity_metrics;
            imageResults.push({
                inspectionImage: image._id,
                imageUrl: image.imageUrl,
                originalFileName: image.originalFileName || "",
                imageWidth,
                imageHeight,
                presence: {
                    label: result.presence.label,
                    confidence: result.presence.confidence,
                    pCracked: result.presence.p_cracked,
                },
                crackCount: result.crack_count,
                severity: imageSeverity,
                severityConfidence: result.severity_confidence,
                severityMetrics: m
                    ? {
                        totalAreaPx: m.total_area_px,
                        totalAreaRatio: m.total_area_ratio,
                        maxLengthPx: m.max_length_px,
                        maxWidthPx: m.max_width_px,
                    }
                    : undefined,
                modelsRun: result.models_run,
                notes: result.notes,
                timingMs: result.timing_ms,
            });

            if (imageSeverity && (!highest || SEVERITY_RANK[imageSeverity] > SEVERITY_RANK[highest])) {
                highest = imageSeverity;
            }

            for (const d of result.detections) {
                totalConfidence += d.confidence;
                totalCracks++;
                if (!highest || SEVERITY_RANK[d.severity] > SEVERITY_RANK[highest]) {
                    highest = d.severity;
                }

                await CrackDetection.create({
                    analysis: analysis._id,
                    inspectionImage: image._id,
                    crackId: `CRK-${String(crackCounter++).padStart(3, "0")}`,
                    mlCrackId: d.crack_id,
                    crackClass: d.crack_class,
                    confidence: d.confidence,
                    severity: d.severity,

                    // Pixel measurements from the segmentation model
                    lengthPx: d.length_px,
                    maxWidthPx: d.max_width_px,
                    meanWidthPx: d.mean_width_px,
                    areaPx: d.area_px,
                    areaRatio: d.area_ratio,
                    lengthRatio: d.length_ratio,
                    maxWidthRatio: d.max_width_ratio,

                    // mm / cm2 need camera calibration, so they stay null
                    width: null,
                    length: null,
                    area: null,

                    boundingBox: d.box,
                    polygons: d.polygons,
                    imageWidth,
                    imageHeight,
                    aiNotes: notes,
                    isValidated: false,
                });
            }

            analysis.processedImages = i + 1;
            analysis.progress = 10 + Math.round(((i + 1) / totalImages) * 75);
            await analysis.save();
        }

        analysis.imageResults = imageResults;

        analysis.currentStep = "Severity classification";
        analysis.progress = 90;
        await analysis.save();

        analysis.averageConfidence =
            totalCracks > 0 ? Number((totalConfidence / totalCracks).toFixed(2)) : 0;
        if (highest) analysis.overallSeverity = highest;
        analysis.riskScore = highest ? RISK_SCORES[highest] : 0;

        analysis.status = "Completed";
        analysis.currentStep = "Analysis completed";
        analysis.progress = 100;
        analysis.completedAt = new Date();
        await analysis.save();

        const inspection = await Inspection.findById(analysis.inspection);

        await createNotification({
            recipient: inspection.createdBy,
            type: "analysis",
            title: "AI Analysis Completed",
            message: `AI analysis for inspection ${inspection.inspectionCode} has completed. You can now review the results.`,
            relatedEntity: "Analysis",
            relatedEntityId: analysis._id,
        });

        await Inspection.findByIdAndUpdate(analysis.inspection, { status: "AI Completed" });

        await logActivity({
            actor: null,
            action: ACTIVITY_ACTIONS.ANALYSIS_COMPLETED,
            targetType: "Analysis",
            targetId: analysis._id,
            targetLabel: analysis.analysisCode,
            metadata: { inspectionCode: inspection?.inspectionCode, simulated: false },
        });
    } catch (error) {
        console.error("Real AI Error:", error.message);

        await AIAnalysis.findByIdAndUpdate(analysisId, {
            status: "Failed",
            currentStep: "Analysis failed",
            errorMessage: String(error.message).slice(0, 500),
        });

        const analysis = await AIAnalysis.findById(analysisId);
        if (analysis) {
            await Inspection.findByIdAndUpdate(analysis.inspection, { status: "Images Uploaded" });
            await logActivity({
                actor: null,
                action: ACTIVITY_ACTIONS.ANALYSIS_FAILED,
                targetType: "Analysis",
                targetId: analysis._id,
                targetLabel: analysis.analysisCode,
                outcome: "failure",
                message: error.message,
            });
            await notifyAdmins({
                type: "critical",
                title: "AI analysis failed",
                message: `Analysis ${analysis.analysisCode} failed: ${error.message}`,
                relatedEntity: "Analysis",
                relatedEntityId: analysis._id,
            });
        }
    }
};

module.exports = { startRealAnalysis };