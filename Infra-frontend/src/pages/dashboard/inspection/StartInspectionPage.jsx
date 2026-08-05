import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import InspectionHeader from "../../../components/inspection/InspectionHeader";
import InspectionStepper from "../../../components/inspection/InspectionStepper";
import InspectionForm from "../../../components/inspection/InspectionForm";

import { getProjects } from "../../../api/projectApi";
import { createInspection } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

const StartInspectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const projectId = location.state?.projectId || "";

    const [projects, setProjects] = useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        project: projectId,
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

    const isProjectLocked = Boolean(projectId);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response =
                    await getProjects();

                setProjects(response.data || []);
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    api: getApiErrorMessage(error),
                }));
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);

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
            const response =
                await createInspection(formData);

            navigate(
                `/dashboard/inspection/${response.data._id}/upload-images`
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

    const handleSaveDraft = async () => {
        setIsSubmitting(true);

        try {
            await createInspection(formData);

            // Success message will be added later.
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                api: getApiErrorMessage(error),
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="start-inspection-page">
                <InspectionHeader
                    title="Start New Inspection"
                    subtitle="Select a project and provide inspection details before uploading images."
                >
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/inspection")}
                    >
                        Back to Inspections
                    </button>
                </InspectionHeader>

                <InspectionStepper currentStep={1} />

                {errors.api && (
                    <div className="inspection-api-error">
                        <p className="form-error">
                            {errors.api}
                        </p>
                    </div>
                )}

                <InspectionForm
                    formData={formData}
                    errors={errors}
                    projects={projects}
                    loadingProjects={loadingProjects}
                    isProjectLocked={isProjectLocked}
                    isSubmitting={isSubmitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onSaveDraft={
                        handleSaveDraft
                    }
                />
            </div>
        </>
    );
};

export default StartInspectionPage;