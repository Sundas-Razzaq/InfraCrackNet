import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InspectionHeader from "../../../components/inspection/InspectionHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";
import InspectionForm from "../../../components/inspection/InspectionForm";

import {
    getInspectionById,
    updateInspection,
} from "../../../api/inspectionApi";

import { getProjects } from "../../../api/projectApi";
import { getApiErrorMessage } from "../../../api/authApi";

import { toast } from "react-toastify";

const EditInspectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingInspection, setLoadingInspection] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        project: "",
        inspectionType: "",
        structureArea: "",
        gpsLocation: "",
        weather: "",
        priority: "Medium",
        scheduledDate: "",
        inspectionDate: "",
        fieldNotes: "",
        assignedEngineers: [],
        assignedInspectors: [],
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [projectsResponse, inspectionResponse] =
                    await Promise.all([
                        getProjects(),
                        getInspectionById(id),
                    ]);

                setProjects(projectsResponse.data || []);

                const inspection =
                    inspectionResponse.data;

                setFormData({
                    project:
                        inspection.project?._id || "",
                    inspectionType:
                        inspection.inspectionType || "",
                    structureArea:
                        inspection.structureArea || "",
                    gpsLocation:
                        inspection.gpsLocation || "",
                    weather:
                        inspection.weather || "",
                    priority:
                        inspection.priority || "Medium",
                    scheduledDate:
                        inspection.scheduledDate
                            ? inspection.scheduledDate.slice(
                                0,
                                10
                            )
                            : "",
                    inspectionDate:
                        inspection.inspectionDate
                            ? inspection.inspectionDate.slice(
                                0,
                                10
                            )
                            : "",
                    fieldNotes:
                        inspection.fieldNotes || "",
                    assignedEngineers:
                        inspection.assignedEngineers?.map(
                            (user) => user._id
                        ) || [],
                    assignedInspectors:
                        inspection.assignedInspectors?.map(
                            (user) => user._id
                        ) || [],
                });
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load inspection."
                    )
                );
            } finally {
                setLoadingProjects(false);
                setLoadingInspection(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            await updateInspection(
                id,
                formData
            );

            toast.success(
                "Inspection updated successfully."
            );

            navigate(
                `/dashboard/inspection/${id}`
            );
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                api: getApiErrorMessage(error),
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingInspection) {
        return (
            <div className="page-loading">
                Loading inspection...
            </div>
        );
    }

    return (
        <div className="edit-inspection-page">

            <InspectionHeader
                title="Edit Inspection"
                subtitle="Update inspection information."
            />

            <InspectionStepper currentStep={1} />

            {errors.api && (
                <p className="form-error">
                    {errors.api}
                </p>
            )}

            <InspectionForm
                formData={formData}
                errors={errors}
                projects={projects}
                loadingProjects={loadingProjects}
                isProjectLocked={false}
                isSubmitting={isSubmitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onSaveDraft={handleSubmit}
                submitButtonText="Update Inspection"
                draftButtonText="Save Changes"
                submittingText="Updating Inspection..."
            />

        </div>
    );
};

export default EditInspectionPage;