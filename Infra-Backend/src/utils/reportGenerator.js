const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const generateReportPDF = async (reportData) => {
    const reportsDir = path.join(__dirname, "../../temp");

    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `${reportData.reportCode}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // HEADER

    doc
        .fontSize(22)
        .text("InfraCrackNet Inspection Report", {
            align: "center",
        });

    doc.moveDown();

    // REPORT INFORMATION

    doc.fontSize(12);

    doc.text(`Report Code: ${reportData.reportCode}`);
    doc.text(`Project: ${reportData.projectName}`);
    doc.text(`Inspection: ${reportData.inspectionCode}`);
    doc.text(`Analysis: ${reportData.analysisCode}`);

    doc.moveDown();

    // AI SUMMARY

    doc.fontSize(14).text("AI Analysis Summary");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.text(
        `Overall Severity: ${reportData.overallSeverity}`
    );

    doc.text(
        `Risk Score: ${reportData.riskScore}`
    );

    doc.text(
        `Average Confidence: ${reportData.averageConfidence}%`
    );

    doc.moveDown();

    // RECOMMENDATIONS

    doc.fontSize(14).text("Recommendations");

    doc.moveDown(0.5);

    doc.fontSize(12);

    reportData.recommendations.forEach((item) => {
        doc.text(`• ${item}`);
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on("finish", async () => {
            try {
                const result = await cloudinary.uploader.upload(
                    filePath,
                    {
                        resource_type: "raw",
                        folder: "InfraCrackNet/Reports",
                        public_id: reportData.reportCode,
                        overwrite: true,
                    }
                );

                fs.unlinkSync(filePath);

                resolve({
                    fileName,
                    reportUrl: result.secure_url,
                });
            } catch (error) {
                reject(error);
            }
        });

        stream.on("error", reject);
    });
};

module.exports = generateReportPDF;