import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import { getValidationResults } from "../../../api/validationApi";

const ValidationPage = () => {
    const { analysisId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchValidationData = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getValidationResults(analysisId);

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

    const validationStats = useMemo(() => {
        if (!data?.cracks) {
            return {
                aiCracks: [],
                confirmed: [],
                removed: [],
                added: [],
                edited: [],
            };
        }

        const cracks = data.cracks;

        const aiCracks = cracks.filter(
            (crack) => crack.source === "AI"
        );

        const confirmed = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Validated"
        );

        const removed = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Removed"
        );

        const added = cracks.filter(
            (crack) => crack.source === "Manual"
        );

        const edited = aiCracks.filter(
            (crack) =>
                crack.validationStatus === "Edited"
        );

        return {
            aiCracks,
            confirmed,
            removed,
            added,
            edited,
        };
    }, [data]);

    if (loading) {
        return (
            <>
                <div className="validation-page">
                    <p>Loading validation...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="validation-page">
                    <p>{error}</p>
                </div>
            </>
        );
    }

    if (!data) {
        return null;
    }

    const {
        analysis,
        summary,
        cracks,
    } = data;

    const {
        aiCracks,
        confirmed,
        removed,
        added,
        edited,
    } = validationStats;

    const engineerCorrections =
        edited.length + removed.length + added.length;

    const overallSeverity =
        summary?.overallSeverity ||
        analysis?.overallSeverity ||
        "N/A";

    const maxWidth =
        summary?.maxWidth ?? 0;

    const averageConfidence =
        summary?.averageConfidence ?? 0;

    return (
        <>

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
                        >
                            Re-analyze
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
                                    Automated
                                </span>
                            </div>

                        </div>

                        <div className="validation-image-container">

                            {aiCracks.length > 0 &&
                                aiCracks[0].inspectionImage ? (
                                <img
                                    src={
                                        aiCracks[0]
                                            .inspectionImage
                                            .imageUrl
                                    }
                                    alt="AI annotated"
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
                                    {aiCracks.length}
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
                                    Max Width
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


                    {/* ENGINEER CORRECTIONS */}

                    <div className="validation-card">

                        <div className="validation-card-header">

                            <div>
                                <h2>
                                    Engineer Corrections
                                </h2>

                                <span>
                                    Reviewed
                                </span>
                            </div>

                        </div>

                        <div className="validation-image-container">

                            {cracks.length > 0 &&
                                cracks[0].inspectionImage ? (
                                <img
                                    src={
                                        cracks[0]
                                            .inspectionImage
                                            .imageUrl
                                    }
                                    alt="Engineer annotated"
                                />
                            ) : (
                                <p>
                                    No reviewed image
                                    available.
                                </p>
                            )}

                        </div>

                        <div className="validation-statistics">

                            <div>
                                <span>
                                    Cracks Confirmed
                                </span>

                                <strong>
                                    {confirmed.length}
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
                                    Corrections
                                </span>

                                <strong>
                                    {engineerCorrections}
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


                {/* VALIDATION SUMMARY */}

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
                                Confirmed by AI & Engineer
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


                    {/* VALIDATION NOTES */}

                    <div className="validation-notes">

                        <strong>
                            Validation Notes:
                        </strong>

                        <span>
                            {edited.length > 0
                                ? `${edited.length} AI detection${edited.length !== 1
                                    ? "s"
                                    : ""
                                } edited during review.`
                                : "No additional validation notes."}
                        </span>

                    </div>

                </div>

            </div>

        </>
    );
};

export default ValidationPage;