import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InspectionHeader from "../../../components/inspection/InspectionHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";

import ImageUploadZone from "../../../components/inspectionImage/ImageUploadZone";
import UploadRequirements from "../../../components/inspectionImage/UploadRequirements";
import UploadedImagesPanel from "../../../components/inspectionImage/UploadedImagesPanel";

import {
    getInspectionImages,
    uploadInspectionImages,
    deleteInspectionImage,
} from "../../../api/inspectionImageApi";

import { getInspectionById } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const UploadImagesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inspection, setInspection] = useState(null);
    const [loading, setLoading] = useState(true);

    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [uploading, setUploading] = useState(false);

    const [deletingImageId, setDeletingImageId] =
        useState(null);

    // Fetch uploaded images
    const fetchInspectionImages = useCallback(async () => {
        const response = await getInspectionImages(id);
        setImages(response.data || []);
    }, [id]);

    useEffect(() => {
        const fetchInspection = async () => {
            try {
                const response =
                    await getInspectionById(id);

                setInspection(response.data);

                await fetchInspectionImages();
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
    }, [id, fetchInspectionImages]);

    // Local file selection
    const handleFilesSelected = (files) => {
        setSelectedFiles((prev) => {
            const existingFiles = [
                ...prev,
                ...images,
            ];

            const newFiles = files.filter((file) => {
                return !existingFiles.some((existing) => {
                    const existingName =
                        existing.originalFileName ||
                        existing.name;

                    const existingSize =
                        existing.fileSize ||
                        existing.size;

                    return (
                        existingName === file.name &&
                        existingSize === file.size
                    );
                });
            });

            if (newFiles.length !== files.length) {
                toast.warning(
                    "Some duplicate images were skipped."
                );
            }

            return [...prev, ...newFiles];
        });
    };

    // Upload images
    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
            toast.warning(
                "Please select at least one image."
            );
            return;
        }

        try {
            setUploading(true);

            await uploadInspectionImages(
                inspection._id,
                selectedFiles
            );

            toast.success(
                "Images uploaded successfully."
            );

            setSelectedFiles([]);

            await fetchInspectionImages();
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to upload images."
                )
            );
        } finally {
            setUploading(false);
        }
    };

    // Delete image
    const handleDeleteImage = async (imageId) => {
        console.log("Deleting image:", imageId);
        try {
            setDeletingImageId(imageId);

            await deleteInspectionImage(imageId);

            toast.success("Image deleted successfully.");

            await fetchInspectionImages();
        } catch (error) {
            console.log(error.response?.data);
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to delete image."
                )
            );
        } finally {
            setDeletingImageId(null);
        }
    };

    // AI module placeholder
    const handleRunAI = () => {
        navigate(`/dashboard/inspection/${inspection._id}/ai-analysis`);
        toast.info(
            "AI Analysis module will be implemented next."
        );
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
        <div className="upload-images-page">

            <InspectionHeader
                title="Upload Inspection Images"
                subtitle={`${inspection.inspectionCode} • ${inspection.project?.name}`}
            />

            <InspectionStepper currentStep={2} />

            <div className="upload-images-layout">

                <div className="upload-images-left">

                    <ImageUploadZone
                        onFilesSelected={handleFilesSelected}
                    />

                    <UploadRequirements />

                </div>

                <div className="upload-images-right">

                    <UploadedImagesPanel
                        images={images}
                        selectedFiles={selectedFiles}
                        uploading={uploading}
                        onUpload={handleUploadImages}
                        onDelete={handleDeleteImage}
                        deletingImageId={deletingImageId}
                        onRunAI={handleRunAI}
                    />

                </div>

            </div>

        </div>
    );
};

export default UploadImagesPage;