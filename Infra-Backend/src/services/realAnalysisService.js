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

        for (let i = 0; i < totalImages; i++) {
            const image = images[i];

            // sequential: ML service ek waqt mein ek image karti hai
            const result = await analyzeImage(image.imageUrl);

            const notes = [
                `Model 1: ${result.presence.label} (P(cracked)=${result.presence.p_cracked}).`,
                ...(result.notes || []),
            ].join(" ").slice(0, 1000);

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
                    crackClass: d.crack_class,
                    confidence: d.confidence,
                    severity: d.severity,
                    // mm / cm2 abhi nahi naapte (alag measurement step), isliye null
                    width: null,
                    length: null,
                    area: null,
                    boundingBox: d.box,
                    segmentationMask: d.polygons?.length ? JSON.stringify(d.polygons) : "",
                    aiNotes: notes,
                    isValidated: false,
                });
            }

            analysis.processedImages = i + 1;
            analysis.progress = 10 + Math.round(((i + 1) / totalImages) * 75);
            await analysis.save();
        }

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
