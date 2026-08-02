import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InspectionHeader from "../../../components/inspection/inspectionHeader";
import InspectionStepper from "../../../components/inspection/inspectionStepper";

import ImageUploadZone from "../../../components/inspectionImage/ImageUploadZone";
import UploadRequirements from "../../../components/inspectionImage/UploadRequirements";
import UploadedImagesPanel from "../../../components/inspectionImage/UploadedImagesPanel";
import { getInspectionImages, } from "../../../api/inspectionImageApi";
import { getInspectionById } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const UploadImagesPage = () => {
    const { id } = useParams();
    // const navigate = useNavigate();
    const [inspection, setInspection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchInspection = async () => {
            try {
                const response = await getInspectionById(id);
                setInspection(response.data);

                const imagesResponse = await getInspectionImages(id);
                setImages(imagesResponse.data || []);
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

    const handleFilesSelected = (files) => {
        setSelectedFiles((prev) => [
            ...prev,
            ...files,
        ]);
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
                        inspection={inspection}
                        onFilesSelected={handleFilesSelected}
                    />

                    <UploadRequirements />
                </div>

                <div className="upload-images-right">
                    <UploadedImagesPanel
                        images={images}
                        selectedFiles={selectedFiles}
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