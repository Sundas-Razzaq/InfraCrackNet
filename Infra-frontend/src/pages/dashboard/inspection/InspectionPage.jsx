import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import InspectionGrid from "../../../components/inspection/inspectionGrid";

import { getInspections } from "../../../api/inspectionApi";
import { getApiErrorMessage } from "../../../api/authApi";

const InspectionsPage = () => {
    const navigate = useNavigate();

    const [inspections, setInspections] = useState([]);
    const [inspectionCount, setInspectionCount] =
        useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInspections = async () => {
            try {
                const response =
                    await getInspections();

                setInspections(response.data || []);
                setInspectionCount(
                    response.count || 0
                );
            } catch (error) {
                setError(
                    getApiErrorMessage(error)
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInspections();
    }, []);

    return (
        <>
            <div className="inspections-page">
                <PageHeader
                    title={`Inspections (${inspectionCount})`}
                    subtitle="Manage all infrastructure inspections."
                >
                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate(
                                "/dashboard/inspection/drafts"
                            )
                        }
                    >
                        Drafts
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                "/dashboard/inspection/new"
                            )
                        }
                    >
                        New Inspection
                    </button>
                </PageHeader>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                <InspectionGrid
                    inspections={inspections}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default InspectionsPage;