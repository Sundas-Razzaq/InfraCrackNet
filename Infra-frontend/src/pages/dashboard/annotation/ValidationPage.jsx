import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startAnalysis } from "../../../api/analysisApi";
import { getValidationResults } from "../../../api/validationApi";

const ValidationPage = () => {
    const { analysisId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reanalyzing, setReanalyzing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchValidationData = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getValidationResults(analysisId);

                console.log(
                    "VALIDATION DATA:",
                    response.data
                );

                setData(response.data);
            } catch (error) {
                console.error(
                    "Failed to load validation data:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load validation data."
                );
            } finally {
                setLoading(false);
            }
        };

        if (analysisId) {
            fetchValidationData();
        }
    }, [analysisId]);

    const handleReanalyze = async () => {
        try {
            const inspectionId = data?.analysis?.inspection?._id;

            if (!inspectionId) {
                setError(
                    "Inspection information is not available."
                );
                return;
            }

            setReanalyzing(true);
            setError("");

            const response = await startAnalysis(
                inspectionId
            );

            console.log(
                "RE-ANALYSIS RESPONSE:",
                response
            );

            const newAnalysisId =
                response?.data?._id;

            if (!newAnalysisId) {
                throw new Error(
                    "New analysis could not be created."
                );
            }

            navigate(
                `/dashboard/inspection/${inspectionId}/ai-analysis/${newAnalysisId}`
            );
        } catch (error) {
            console.error(
                "Failed to start re-analysis:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to start re-analysis."
            );
        } finally {
            setReanalyzing(false);
        }
    };

    /*VALIDATION DATA*/

    const validationStats = useMemo(() => {
        const cracks = data?.cracks || [];

        const aiCracks = cracks.filter(
            (crack) => crack.source === "AI"
        );

        const confirmed = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Validated"
        );

        const edited = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Edited"
        );

        const removed = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Removed"
        );

        const added = cracks.filter(
            (crack) =>
                crack.source === "Manual"
        );

        return {
            aiCracks,
            confirmed,
            edited,
            removed,
            added,
        };
    }, [data]);

    /*CHECK WHETHER ENGINEER REVIEW HAS HAPPENED*/

    const hasAnnotation = useMemo(() => {
        const cracks = data?.cracks || [];

        return cracks.some(
            (crack) =>
                crack.source === "Manual" ||
                crack.validationStatus !== "Pending" ||
                crack.reviewStatus !== "Pending" ||
                crack.isValidated === true
        );
    }, [data]);

    /*LOADING / ERROR STATES */

    if (loading) {
        return (
            <div className="validation-page">
                <p>Loading validation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="validation-page">
                <p>{error}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    /* BACKEND DATA*/

    const {
        analysis,
        summary,
        cracks = [],
    } = data;

    const {
        aiCracks,
        confirmed,
        edited,
        removed,
        added,
    } = validationStats;

    /*AI ANALYSIS VALUES*/

    const totalCracks =
        summary?.totalCracks ??
        analysis?.totalCracks ??
        aiCracks.length;

    const averageConfidence =
        summary?.averageConfidence ??
        analysis?.averageConfidence ??
        0;

    const maxWidth =
        summary?.maxWidth ?? 0;

    const totalAffectedArea =
        summary?.totalAffectedArea ?? 0;

    const overallSeverity =
        summary?.overallSeverity ||
        analysis?.overallSeverity ||
        "N/A";

    const riskScore =
        summary?.riskScore ??
        analysis?.riskScore ??
        0;

    /*ENGINEER REVIEW VALUES*/

    const engineerCorrections =
        edited.length +
        removed.length +
        added.length;

    /*Active detections after engineer review:*/

    const finalDetectionCount =
        confirmed.length +
        edited.length +
        added.length;

    /*PREVIEW IMAGE*/

    const previewImage =
        cracks.find(
            (crack) =>
                crack.inspectionImage?.imageUrl
        )?.inspectionImage?.imageUrl || null;


    /*AI-ONLY VIEW*/

    if (!hasAnnotation) {
        return (
            <div className="validation-page">

                {/* PAGE HEADER */}

                <div className="validation-header">

                    <div>
                        <h1>
                            AI vs Human Validation
                        </h1>

                        <p>
                            Compare AI output with
                            engineer corrections
                            before finalizing
                        </p>
                    </div>

                    <div className="validation-actions">

                        <button
                            type="button"
                            className="btn btn-danger"
                        >
                            Reject
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReanalyze}
                            disabled={reanalyzing}
                        >
                            {reanalyzing
                                ? "Re-analyzing..."
                                : "Re-analyze"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                        >
                            Approve & Finalize
                        </button>

                    </div>

                </div>

                {/* AI SUMMARY */}

                <div className="validation-statistics">

                    <div>
                        <span>
                            Cracks Detected
                        </span>

                        <strong>
                            {totalCracks}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Average Confidence
                        </span>

                        <strong>
                            {averageConfidence}%
                        </strong>
                    </div>

                    <div>
                        <span>
                            Maximum Crack Width
                        </span>

                        <strong>
                            {maxWidth} mm
                        </strong>
                    </div>

                    <div>
                        <span>
                            Affected Area
                        </span>

                        <strong>
                            {totalAffectedArea} cm²
                        </strong>
                    </div>

                </div>

                {/* AI DETECTION PREVIEW */}

                <div className="validation-card">

                    <div className="validation-card-header">

                        <div>
                            <h2>
                                Detection Preview
                            </h2>

                            <span>
                                Automated AI Detection
                            </span>
                        </div>

                    </div>

                    <div className="validation-image-container">

                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="AI detection preview"
                            />
                        ) : (
                            <p>
                                No detection image available.
                            </p>
                        )}

                    </div>

                </div>

                {/* AI DETECTION SUMMARY */}

                <div className="validation-summary">

                    <h2>
                        Detected Cracks
                    </h2>

                    {aiCracks.length === 0 ? (
                        <p>
                            No cracks were detected.
                        </p>
                    ) : (
                        <div className="summary-cards">

                            <div className="summary-card">

                                <strong>
                                    {aiCracks.length}
                                </strong>

                                <span>
                                    AI Detections
                                </span>

                            </div>

                            <div className="summary-card">

                                <strong>
                                    {overallSeverity}
                                </strong>

                                <span>
                                    Overall Severity
                                </span>

                            </div>

                            <div className="summary-card">

                                <strong>
                                    {riskScore}%
                                </strong>

                                <span>
                                    Risk Score
                                </span>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        );
    }

    /*AI VS ENGINEER COMPARISON*/

    return (
        <div className="validation-page">

            {/* PAGE HEADER */}

            <div className="validation-header">

                <div>
                    <h1>
                        AI vs Human Validation
                    </h1>

                    <p>
                        Compare AI output with
                        engineer corrections
                        before finalizing
                    </p>
                </div>

                <div className="validation-actions">

                    <button
                        type="button"
                        className="btn btn-danger"
                    >
                        Reject
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReanalyze}
                        disabled={reanalyzing}
                    >
                        {reanalyzing
                            ? "Re-analyzing..."
                            : "Re-analyze"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                    >
                        Approve & Finalize
                    </button>

                </div>

            </div>

            {/* COMPARISON */}

            <div className="validation-comparison">

                {/* AI OUTPUT */}

                <div className="validation-card">

                    <div className="validation-card-header">

                        <div>
                            <h2>
                                AI Detection Output
                            </h2>

                            <span>
                                Original Automated Result
                            </span>
                        </div>

                    </div>

                    <div className="validation-image-container">

                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="AI detection"
                            />
                        ) : (
                            <p>
                                No AI image available.
                            </p>
                        )}

                    </div>

                    <div className="validation-statistics">

                        <div>
                            <span>
                                Cracks Detected
                            </span>

                            <strong>
                                {totalCracks}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Overall Severity
                            </span>

                            <strong>
                                {overallSeverity}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Maximum Width
                            </span>

                            <strong>
                                {maxWidth} mm
                            </strong>
                        </div>

                        <div>
                            <span>
                                AI Confidence
                            </span>

                            <strong>
                                {averageConfidence}%
                            </strong>
                        </div>

                    </div>

                </div>

                {/* ENGINEER RESULT */}

                <div className="validation-card">

                    <div className="validation-card-header">

                        <div>
                            <h2>
                                Engineer Corrections
                            </h2>

                            <span>
                                Reviewed Result
                            </span>
                        </div>

                    </div>

                    <div className="validation-image-container">

                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Engineer reviewed result"
                            />
                        ) : (
                            <p>
                                No reviewed image available.
                            </p>
                        )}

                    </div>

                    <div className="validation-statistics">

                        <div>
                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {confirmed.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Edited
                            </span>

                            <strong>
                                {edited.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Removed
                            </span>

                            <strong>
                                {removed.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Added by Engineer
                            </span>

                            <strong>
                                {added.length}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

            {/* ENGINEER REVIEW RESULT */}

            <div className="validation-summary">

                <h2>
                    Validation Summary
                </h2>

                <div className="summary-cards">

                    <div className="summary-card">

                        <strong>
                            {confirmed.length}
                        </strong>

                        <span>
                            Confirmed by Engineer
                        </span>

                    </div>

                    <div className="summary-card">

                        <strong>
                            {edited.length}
                        </strong>

                        <span>
                            AI Detections Edited
                        </span>

                    </div>

                    <div className="summary-card">

                        <strong>
                            {removed.length}
                        </strong>

                        <span>
                            AI False Positives Removed
                        </span>

                    </div>

                    <div className="summary-card">

                        <strong>
                            {added.length}
                        </strong>

                        <span>
                            Added by Engineer
                        </span>

                    </div>

                </div>

                {/* FINAL DETECTION COUNT */}

                <div className="validation-notes">

                    <strong>
                        Final Detection Count:
                    </strong>

                    <span>
                        {finalDetectionCount}
                    </span>

                </div>

                {/* VALIDATION NOTES */}

                <div className="validation-notes">

                    <strong>
                        Validation Notes:
                    </strong>

                    <span>
                        {engineerCorrections > 0
                            ? `${engineerCorrections} correction${engineerCorrections !== 1
                                ? "s"
                                : ""
                            } made during annotation.`
                            : "No corrections were made during annotation."
                        }
                    </span>

                </div>

            </div>

        </div>
    );
};

export default ValidationPage;