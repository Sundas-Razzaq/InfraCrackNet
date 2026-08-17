import { useEffect, useRef, useState, useCallback, } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";

import AnalysisProgressCard from "../../../components/analysis/AnalysisProgressCard";
import ProcessingTimeline from "../../../components/analysis/ProcessingTimeline";

import {
    startAnalysis,
    getInspectionAnalysis,
    getAnalysisProgress,
    cancelAnalysis,
} from "../../../api/analysisApi";

import { getInspectionById } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const AIProcessingPage = () => {
    const { inspectionId } = useParams();

    const navigate = useNavigate();

    const pollingRef = useRef(null);

    const [inspection, setInspection] =
        useState(null);

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [cancelLoading, setCancelLoading] =
        useState(false);

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const startPolling = useCallback(
        (id) => {
            stopPolling();

            pollingRef.current = setInterval(
                async () => {
                    try {
                        const response =
                            await getAnalysisProgress(id);

                        const analysisData =
                            response.data;

                        setAnalysis((prev) => ({
                            ...prev,
                            ...analysisData,
                        }));
                        if (analysisData.status === "Completed") {
                            stopPolling();

                            const latest = await getInspectionAnalysis(inspectionId);

                            setAnalysis(latest.data);

                            return;
                        }

                        if (
                            analysisData.status ===
                            "Cancelled" ||
                            analysisData.status ===
                            "Failed"
                        ) {
                            stopPolling();
                        }
                    } catch (error) {
                        stopPolling();

                        toast.error(
                            getApiErrorMessage(error)
                        );
                    }
                },
                1000
            );
        },
        [inspectionId]
    );

    useEffect(() => {
        const initialize = async () => {
            try {
                const inspectionResponse =
                    await getInspectionById(
                        inspectionId
                    );

                setInspection(
                    inspectionResponse.data
                );

                let analysisResponse =
                    await getInspectionAnalysis(
                        inspectionId
                    );

                let analysisData =
                    analysisResponse.data;

                if (!analysisData) {
                    const created =
                        await startAnalysis(
                            inspectionId
                        );

                    analysisData =
                        created.data;
                }

                setAnalysis(analysisData);

                startPolling(
                    analysisData._id
                );
            } catch (error) {
                toast.error(
                    getApiErrorMessage(error)
                );
            } finally {
                setLoading(false);
            }
        };

        initialize();

        return () => stopPolling();
    }, [inspectionId, startPolling]);

    const handleCancel = async () => {
        try {
            setCancelLoading(true);

            await cancelAnalysis(
                analysis._id
            );

            toast.success(
                "Analysis cancelled."
            );

            stopPolling();

            navigate(
                `/dashboard/inspection/${inspectionId}/upload-images`
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(error)
            );
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading || !inspection || !analysis) {
        return (
            <div className="page-loading">
                Starting AI Analysis...
            </div>
        );
    }

    return (
        <div className="analysis-page">

            <PageHeader
                title="AI Crack Detection"
                subtitle={`${inspection.inspectionCode} • ${inspection.project?.name}`}
            />

            <InspectionStepper currentStep={3} />

            <div className="analysis-container">

                <AnalysisProgressCard
                    analysis={analysis}
                />

                <ProcessingTimeline
                    currentStep={analysis.currentStep}
                />

                <div className="analysis-actions">

                    <button
                        className="btn btn-danger"
                        onClick={handleCancel}
                        disabled={cancelLoading}
                    >
                        {cancelLoading
                            ? "Cancelling..."
                            : "Cancel Analysis"}
                    </button>

                    {analysis.status === "Completed" && (

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(
                                    `/dashboard/inspection/${inspectionId}/ai-results/${analysis._id}`
                                )
                            }
                        >
                            View Results
                        </button>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AIProcessingPage;