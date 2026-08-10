import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InspectionDetails from "../../../components/inspection/inspectionDetails";
import DeleteConfirmationModal from "../../../components/common/deleteConfirmationModal";

import {
    getInspectionById,
    deleteInspection,
} from "../../../api/inspectionApi";

import { getApiErrorMessage } from "../../../api/authApi";
import { toast } from "react-toastify";

const InspectionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inspection, setInspection] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    useEffect(() => {
        const fetchInspection = async () => {
            try {
                const response =
                    await getInspectionById(id);

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
        navigate(
            `/dashboard/inspection/${inspection._id}/edit`
        );
    };

    const handleUploadImages = () => {
        navigate(
            `/dashboard/inspection/${inspection._id}/upload-images`
        );
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await deleteInspection(
                inspection._id
            );

            toast.success(
                "Inspection deleted successfully."
            );

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
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Inspection"
                description="Are you sure you want to delete this inspection?"
                warning="This will permanently delete all uploaded images, AI analyses, crack detections and generated reports related to this inspection."
                confirmText="Delete Inspection"
                loadingText="Deleting..."
                isLoading={deleteLoading}
                onClose={() =>
                    setShowDeleteModal(false)
                }
                onConfirm={handleDelete}
            />
        </>
    );
};

export default InspectionDetailsPage;