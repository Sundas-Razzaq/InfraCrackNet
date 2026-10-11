import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InspectionDetails from "../../../components/inspection/inspectionDetails";
import DeleteConfirmationModal from "../../../components/common/deleteConfirmationModal";

import {
    getInspectionById,
    deleteInspection,
} from "../../../api/inspectionApi";
import { startAnalysis, getInspectionAnalysis } from "../../../api/analysisApi";
import { generateReport } from "../../../api/reportApi";

import { getApiErrorMessage } from "../../../api/authApi";
import { toast } from "react-toastify";

const InspectionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inspection, setInspection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        const fetchInspection = async () => {
            try {
                const response = await getInspectionById(id);
                setInspection(response.data);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load inspection."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInspection();
    }, [id]);

    const handleEdit = () => {
        navigate(`/dashboard/inspection/${inspection._id}/edit`);
    };

    const handleUploadImages = () => {
        navigate(
            `/dashboard/inspection/${inspection._id}/upload-images`
        );
    };

    const handleRunAnalysis = async () => {
        try {
            setAnalysisLoading(true);

            const response = await startAnalysis(inspection._id);

            toast.success(response.message);

            navigate(
                `/dashboard/inspection/${inspection._id}/ai-analysis/${response.data._id}`
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to start AI analysis."
                )
            );
        } finally {
            setAnalysisLoading(false);
        }
    };

    // CHANGED: Inspector generates the report from a validated inspection.
    const handleGenerateReport = async () => {
        try {
            setReportLoading(true);

            // Find the latest analysis for this inspection
            const analysisResponse = await getInspectionAnalysis(
                inspection._id
            );

            const analysis = analysisResponse.data;

            if (!analysis || !analysis._id) {
                toast.error(
                    "No analysis found for this inspection."
                );
                return;
            }

            const response = await generateReport(analysis._id);

            toast.success("Report generated successfully.");

            const reportId = response?.data?._id;

            navigate(
                `/dashboard/inspection/${inspection._id}/report/${reportId}`
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to generate report."
                )
            );
        } finally {
            setReportLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteInspection(inspection._id);
            toast.success("Inspection deleted successfully.");
            navigate("/dashboard/inspection");
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to delete inspection."
                )
            );
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading inspection...
            </div>
        );
    }

    if (!inspection) {
        return (
            <div className="page-loading">
                Inspection not found.
            </div>
        );
    }

    return (
        <>
            <InspectionDetails
                inspection={inspection}
                onEdit={handleEdit}
                onDelete={() => setShowDeleteModal(true)}
                onUploadImages={handleUploadImages}
                onRunAnalysis={handleRunAnalysis}
                analysisLoading={analysisLoading}
                onGenerateReport={handleGenerateReport}
                reportLoading={reportLoading}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Inspection"
                description="Are you sure you want to delete this inspection?"
                warning="This will permanently delete all uploaded images, AI analyses, crack detections and generated reports related to this inspection."
                confirmText="Delete Inspection"
                loadingText="Deleting..."
                isLoading={deleteLoading}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default InspectionDetailsPage;