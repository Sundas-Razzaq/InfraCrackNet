import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import InspectionHeader from "../../../components/inspection/InspectionHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";

import AnnotationToolbar from "../../../components/annotation/AnnotationToolbar";
import AnnotationCanvas from "../../../components/annotation/AnnotationCanvas";
import ImageNavigator from "../../../components/annotation/ImageNavigator";
import AnnotationSidebar from "../../../components/annotation/AnnotationSidebar";
import CompleteReviewBar from "../../../components/annotation/CompleteReviewBar";

import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";
import { completeAnnotationReview, getAnnotationWorkspace, addManualCrack, updateCrack, removeCrack } from "../../../api/annotationApi";
import CrackEditorModal from "../../../components/annotation/CrackEditorModal";
import ManualCrackModal from "../../../components/annotation/ManualCrackModal";
import { useNavigate } from "react-router-dom";

const AnnotationWorkspacePage = () => {
    const { inspectionId, analysisId } = useParams();
    const navigate = useNavigate();
    const [completing, setCompleting] = useState(false);

    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCrack, setSelectedCrack] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualModalSession, setManualModalSession] = useState(0);
    const [savingManualCrack, setSavingManualCrack] = useState(false);

    const fetchWorkspace = useCallback(async () => {
        try {
            setLoading(true);

            const response =
                await getAnnotationWorkspace(
                    analysisId
                );

            setWorkspace(response.data);
            if (
                response.data.images.length > 0
            ) {
                setSelectedImage(
                    response.data.images[0]
                );
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to load annotation workspace."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [analysisId]);

    useEffect(() => {
        const loadWorkspace = async () => {
            await fetchWorkspace();
        };

        loadWorkspace();
    }, [fetchWorkspace]);

    if (loading) {
        return (
            <div className="page-loading">
                Loading Annotation Workspace...
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="page-loading">
                Annotation workspace not found.
            </div>
        );
    }

    const {
        analysis,
        images,
        cracks,
        summary,
    } = workspace;

    const handleCloseEditor = () => {
        setShowEditor(false);
        setSelectedCrack(null);
    };


    const handleSaveCrack = async (
        crackId,
        updatedData
    ) => {
        try {
            setSaving(true);

            await updateCrack(
                crackId,
                updatedData
            );

            toast.success(
                "Crack updated successfully."
            );

            setShowEditor(false);

            setSelectedCrack(null);

            await fetchWorkspace();
        } catch (error) {
            toast.error(
                getApiErrorMessage(error)
            );
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveCrack = async (crackId) => {
        try {
            setSaving(true);

            await removeCrack(crackId);

            toast.success("Crack removed successfully.");

            setShowEditor(false);
            setSelectedCrack(null);

            await fetchWorkspace();
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const handleOpenManualModal = () => {
        setManualModalSession((prev) => prev + 1);
        setShowManualModal(true);
    };

    const handleCloseManualModal = () => {
        setShowManualModal(false);
    };

    const handleAddManualCrack = async (
        crackData
    ) => {
        try {
            setSavingManualCrack(true);

            await addManualCrack({
                ...crackData,
                analysis: analysisId,
            });

            toast.success(
                "Manual crack added successfully."
            );

            setShowManualModal(false);

            await fetchWorkspace();
        } catch (error) {
            toast.error(
                getApiErrorMessage(error)
            );
        } finally {
            setSavingManualCrack(false);
        }
    };
    const handleCompleteReview = async () => {
        try {
            setCompleting(true);

            await completeAnnotationReview(
                analysisId
            );

            toast.success(
                "Annotation review completed."
            );

            navigate(
                `/dashboard/inspection/${inspectionId}/validation/${analysisId}`
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(error)
            );
        } finally {
            setCompleting(false);
        }
    };
    return (
        <div className="annotation-page">

            <InspectionHeader
                title="Annotation Workspace"
                subtitle={`${analysis.inspection.inspectionCode} • ${analysis.inspection.project.name}`}
            />

            <InspectionStepper currentStep={4} />
            <AnnotationToolbar
                reviewSummary={workspace.summary}
                onRefresh={fetchWorkspace}
                onAddManualCrack={
                    handleOpenManualModal
                }
            />
            <div className="annotation-workspace">

                <div className="annotation-left">

                    <ImageNavigator
                        images={images}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                    />

                    <AnnotationCanvas
                        image={selectedImage || images[0]}
                        cracks={cracks}
                        selectedCrack={selectedCrack}
                        onSelectCrack={setSelectedCrack}
                    />

                </div>

                <AnnotationSidebar
                    summary={summary}
                    cracks={cracks}
                    selectedCrack={selectedCrack}
                    onSelectCrack={setSelectedCrack}
                />

            </div>

            <CompleteReviewBar
                summary={workspace.summary}
                isCompleting={completing}
                onComplete={handleCompleteReview}
            />

            <CrackEditorModal
                key={`${selectedCrack?._id || "crack-editor"}-${showEditor ? "open" : "closed"}`}
                crack={selectedCrack}
                isOpen={showEditor}
                isSaving={saving}
                onClose={handleCloseEditor}
                onSave={handleSaveCrack}
                onRemove={handleRemoveCrack}
            />

            <ManualCrackModal
                key={manualModalSession}
                isOpen={showManualModal}
                isSaving={savingManualCrack}
                image={selectedImage || images[0]}
                analysisId={analysisId}
                onClose={handleCloseManualModal}
                onSave={handleAddManualCrack}
            />
        </div>
    );

};

export default AnnotationWorkspacePage;