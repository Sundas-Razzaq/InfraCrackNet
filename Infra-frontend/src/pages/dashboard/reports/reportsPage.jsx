import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../../../components/dashboard/shared/EmptyState";
import ReportCard from "../../../components/reports/reportCard";
import { getAllReports } from "../../../api/reportApi";
import { getApiErrorMessage } from "../../../api/authApi";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

const ReportsPage = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getAllReports();

                setReports(response.data || []);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load reports."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleReportClick = (reportId) => {
        navigate(`/dashboard/reports/${reportId}`);
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading reports...
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="reports-page-header">
                <div>
                    <h1>Reports</h1>

                    <p>
                        View and manage generated inspection reports.
                    </p>
                </div>
            </div>

            {reports.length === 0 ? (
                <EmptyState
                    icon={faFileLines}
                    title="No Reports Available"
                    message="Generated inspection reports will appear here."
                />
            ) : (
                <div className="reports-grid">
                    {reports.map((report) => (
                        <ReportCard
                            key={report._id}
                            report={report}
                            onClick={handleReportClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportsPage;