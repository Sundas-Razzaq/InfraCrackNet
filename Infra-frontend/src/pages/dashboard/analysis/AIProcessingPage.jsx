import { useEffect, useRef, useState, useCallback, } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InspectionHeader from "../../../components/inspection/inspectionHeader";
import InspectionStepper from "../../../components/inspection/inspectionStepper";

import ProcessingTimeline from "../../../components/analysis/ProcessingTimeline";
import AnalysisProgressCard from "../../../components/analysis/AnalysisProgressCard";

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

    const [analysisId, setAnalysisId] =
        useState(null);

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [cancelLoading, setCancelLoading] =
        useState(false);

    // Poll Progress

    const startPolling = useCallback(
        (id) => {
            pollingRef.current =
                setInterval(async () => {
                    try {
                        const response =
                            await getAnalysisProgress(id);

                        setAnalysis(response.data);

                        if (
                            response.data.status ===
                            "Completed"
                        ) {
                            clearInterval(
                                pollingRef.current
                            );

                            navigate(
                                `/dashboard/inspection/${inspectionId}/ai-results/${id}`
                            );
                        }

                        if (
                            response.data.status ===
                            "Cancelled" ||
                            response.data.status ===
                            "Failed"
                        ) {
                            clearInterval(
                                pollingRef.current
                            );
                        }
                    } catch (error) {
                        clearInterval(
                            pollingRef.current
                        );

                        toast.error(
                            getApiErrorMessage(error)
                        );
                    }
                }, 1000);
        },
        [inspectionId, navigate]
    );

    // Initial Load

    useEffect(() => {
        const initialize =
            async () => {
                try {
                    const inspectionResponse =
                        await getInspectionById(
                            inspectionId
                        );

                    setInspection(
                        inspectionResponse.data
                    );

                    const existingAnalysis =
                        await getInspectionAnalysis(
                            inspectionId
                        );

                    if (
                        existingAnalysis.data
                    ) {
                        setAnalysisId(
                            existingAnalysis.data
                                ._id
                        );

                        startPolling(
                            existingAnalysis.data
                                ._id
                        );
                    } else {
                        const created =
                            await startAnalysis(
                                inspectionId
                            );

                        setAnalysisId(
                            created.data._id
                        );

                        startPolling(
                            created.data._id
                        );
                    }
                } catch (error) {
                    toast.error(
                        getApiErrorMessage(
                            error
                        )
                    );
                } finally {
                    setLoading(false);
                }
            };

        initialize();

        return () => {
            if (pollingRef.current) {
                clearInterval(
                    pollingRef.current
                );
            }
        };
    }, [inspectionId, startPolling]);

    // Cancel
    const handleCancel =
        async () => {
            try {
                setCancelLoading(true);

                await cancelAnalysis(
                    analysisId
                );

                toast.success(
                    "Analysis cancelled."
                );

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

    if (loading) {
        return (
            <div className="page-loading">
                Starting AI Analysis...
            </div>
        );
    }

    return (
        <div className="analysis-page">

            <InspectionHeader
                title="AI Crack Detection"
                subtitle={`${inspection.inspectionCode} • ${inspection.project?.name}`}
            />

            <InspectionStepper currentStep={3} />

            <div className="analysis-layout">

                <AnalysisProgressCard
                    analysis={analysis}
                    onCancel={
                        handleCancel
                    }
                    cancelling={
                        cancelLoading
                    }
                />

                <ProcessingTimeline
                    currentStep={
                        analysis?.currentStep
                    }
                />

            </div>

        </div>
    );
};

export default AIProcessingPage;