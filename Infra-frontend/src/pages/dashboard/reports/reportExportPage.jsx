import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../../components/dashboard/shared/PageHeader";

import {
    getReport,
    downloadReport,
} from "../../../api/reportApi";

import { getApiErrorMessage } from "../../../api/authApi";

const ReportExportPage = () => {
    const { reportId } = useParams();

    const [report, setReport] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    /*
     * LOAD REPORT + PDF PREVIEW
     */
    useEffect(() => {
        let objectUrl = null;

        const fetchReport = async () => {
            try {
                setLoading(true);

                // Get report metadata
                const response = await getReport(reportId);

                const reportData = response.data.report;

                setReport(reportData);

                // Get the actual generated PDF
                const pdfResponse =
                    await downloadReport(reportId);

                const blob = new Blob(
                    [pdfResponse.data],
                    {
                        type: "application/pdf",
                    }
                );

                objectUrl =
                    window.URL.createObjectURL(blob);

                setPdfUrl(objectUrl);
            } catch (error) {
                console.error(
                    "REPORT EXPORT ERROR:",
                    error
                );

                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load report."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        if (reportId) {
            fetchReport();
        }

        // Clean up Blob URL when leaving the page
        return () => {
            if (objectUrl) {
                window.URL.revokeObjectURL(objectUrl);
            }
        };
    }, [reportId]);

    /*
     * DOWNLOAD REPORT
     */
    const handleDownload = async () => {
        try {
            setDownloading(true);

            const response =
                await downloadReport(reportId);

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                report?.fileName ||
                `${report?.reportCode || "report"}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                "Report downloaded successfully."
            );
        } catch (error) {
            console.error(
                "REPORT DOWNLOAD ERROR:",
                error
            );

            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to download report."
                )
            );
        } finally {
            setDownloading(false);
        }
    };

    /*
     * LOADING
     */
    if (loading) {
        return (
            <div className="page-loading">
                Loading report...
            </div>
        );
    }

    /*
     * REPORT NOT FOUND
     */
    if (!report) {
        return (
            <div className="page-loading">
                Report not found.
            </div>
        );
    }

    const {
        reportCode,
        inspection,
    } = report;

    return (
        <div className="report-export-page">

            {/* EXPORT HEADER */}

            <div className="report-export-header">

                <PageHeader
                    title="Export Report"
                    subtitle={`${reportCode} • ${inspection?.project?.name ||
                        "Unnamed Project"
                        }`}
                />

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    {downloading
                        ? "Downloading..."
                        : "Download Report"}
                </button>

            </div>

            {/* ACTUAL GENERATED PDF */}

            <div className="report-pdf-preview">

                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title="Generated Inspection Report"
                        className="report-pdf-viewer"
                    />
                ) : (
                    <div className="page-loading">
                        Report preview unavailable.
                    </div>
                )}

            </div>

        </div>
    );
};

export default ReportExportPage;