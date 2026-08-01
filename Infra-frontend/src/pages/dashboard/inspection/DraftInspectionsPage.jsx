import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import InspectionHeader from "../../../components/inspection/inspectionHeader";
import InspectionGrid from "../../../components/inspection/inspectionGrid";

import { getDraftInspections } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

const DraftInspectionsPage = () => {
    const navigate = useNavigate();

    const [drafts, setDrafts] = useState([]);
    const [draftCount, setDraftCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const response =
                    await getDraftInspections();

                setDrafts(response.data || []);
                setDraftCount(response.count || 0);
            } catch (error) {
                setError(getApiErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, []);

    return (
        <>
            <div className="draft-inspections-page">
                <InspectionHeader
                    title={`Draft Inspections (${draftCount})`}
                    subtitle="Continue your unfinished infrastructure inspections."
                >
                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/dashboard/inspection")
                        }
                    >
                        Back to Inspections
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/dashboard/inspection/new")
                        }
                    >
                        New Inspection
                    </button>
                </InspectionHeader>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                <InspectionGrid
                    inspections={drafts}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default DraftInspectionsPage;