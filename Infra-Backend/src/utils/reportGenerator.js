const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReportPDF = async (reportData) => {
    const reportsDir = path.join(__dirname, "../reports");
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

    const PRIMARY = "#1E3A8A";
    const LIGHT = "#F8FAFC";
    const BORDER = "#D1D5DB";
    const TEXT = "#1F2937";

    const PAGE_MARGIN = 50;
    const CONTENT_WIDTH = 495;

    const drawHeader = (doc, reportCode) => {

        const top = 35;

        doc
            .rect(0, 0, doc.page.width, 90)
            .fill(PRIMARY);

        doc
            .fillColor("white")
            .font("Helvetica-Bold")
            .fontSize(24)
            .text(
                "InfraCrackNet",
                PAGE_MARGIN,
                top
            );

        doc
            .font("Helvetica")
            .fontSize(11)
            .text(
                "AI-Assisted Infrastructure Inspection Report",
                PAGE_MARGIN,
                top + 30
            );

        doc
            .fontSize(10)
            .text(
                `Report: ${reportCode}`,
                430,
                top + 20
            );

        doc.moveDown(4);

    };

    const drawFooter = (doc, page) => {

        const y = doc.page.height - 65;

        // Save current drawing position
        const currentX = doc.x;
        const currentY = doc.y;

        doc
            .strokeColor(BORDER)
            .moveTo(50, y)
            .lineTo(545, y)
            .stroke();

        doc
            .fillColor("gray")
            .font("Helvetica")
            .fontSize(9);

        doc.text(
            "InfraCrackNet",
            50,
            y + 10,
            {
                width: 150,
                lineBreak: false
            }
        );

        doc.text(
            `Generated: ${new Date().toLocaleDateString()}`,
            200,
            y + 10,
            {
                width: 170,
                align: "center",
                lineBreak: false
            }
        );

        doc.text(
            `Page ${page}`,
            430,
            y + 10,
            {
                width: 100,
                align: "right",
                lineBreak: false
            }
        );

        // Restore the cursor
        doc.x = currentX;
        doc.y = currentY;

    };

    const drawSectionTitle = (doc, title) => {

        doc.moveDown();

        doc
            .fillColor(PRIMARY)
            .font("Helvetica-Bold")
            .fontSize(16)
            .text(title);

        doc
            .strokeColor(PRIMARY)
            .moveTo(50, doc.y + 2)
            .lineTo(545, doc.y + 2)
            .stroke();

        doc.moveDown(.8);

    };

    const drawKeyValue = (doc, label, value) => {

        doc.x = PAGE_MARGIN;

        doc.font("Helvetica-Bold")
            .text(label + ": ", 50, doc.y, {
                continued: true
            });

        doc.font("Helvetica")
            .text(value || "-");

        doc.x = PAGE_MARGIN;

    };

    const drawInfoCard = (
        doc,
        title,
        value
    ) => {

        const startY = doc.y;

        doc
            .roundedRect(
                50,
                startY,
                495,
                45,
                5
            )
            .fillAndStroke(
                LIGHT,
                BORDER
            );

        doc
            .fillColor("gray")
            .fontSize(9)
            .text(
                title,
                60,
                startY + 8
            );

        doc
            .fillColor(TEXT)
            .font("Helvetica-Bold")
            .fontSize(14)
            .text(
                value !== undefined &&
                    value !== null &&
                    value !== ""
                    ? String(value)
                    : "-",
                60,
                startY + 22
            );

        doc.y = startY + 55;

    };

    const drawRecommendations = (doc, recommendations = []) => {

        if (!recommendations.length) {

            doc.text("No recommendations available.");

            return;

        }

        recommendations.forEach(item => {

            doc.text(`• ${item}`);

        });

    };

    const nextPage = (doc, pageNumber, reportCode) => {

        drawFooter(doc, pageNumber);

        doc.addPage();

        drawHeader(doc, reportCode);

    };

    // PAGE 1

    drawHeader(doc, reportData.reportCode);

    // REPORT INFORMATION

    drawSectionTitle(doc, "Report Information");

    drawKeyValue(
        doc,
        "Report Code",
        reportData.reportCode
    );

    drawKeyValue(
        doc,
        "Analysis Code",
        reportData.analysisCode
    );

    drawKeyValue(
        doc,
        "Generated On",
        new Date().toLocaleString()
    );

    // EXECUTIVE SUMMARY

    drawSectionTitle(doc, "Executive Summary");

    doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor(TEXT)
        .text(
            reportData.executiveSummary ||
            "This report presents the results of an AI-assisted infrastructure inspection. Crack detections were generated by the AI engine and subsequently reviewed and validated by an authorised engineer before the final report was generated.",
            {
                align: "justify",
                lineGap: 4,
            }
        );

    // PROJECT INFORMATION

    drawSectionTitle(doc, "Project Information");

    drawKeyValue(doc, "Project Name", reportData.projectName);
    drawKeyValue(doc, "Project Code", reportData.projectCode);
    drawKeyValue(doc, "Structure Type", reportData.structureType);
    drawKeyValue(doc, "Location", reportData.location);
    drawKeyValue(doc, "Priority", reportData.priority);

    // INSPECTION INFORMATION

    drawSectionTitle(doc, "Inspection Information");

    drawKeyValue(
        doc,
        "Inspection Code",
        reportData.inspectionCode
    );

    drawKeyValue(
        doc,
        "Inspection Type",
        reportData.inspectionType
    );

    drawKeyValue(
        doc,
        "Inspection Date",
        reportData.inspectionDate
    );

    drawKeyValue(
        doc,
        "Structure Area",
        reportData.structureArea
    );

    drawKeyValue(
        doc,
        "Weather",
        reportData.weather
    );

    drawKeyValue(
        doc,
        "GPS Location",
        reportData.gpsLocation
    );

    // OVERALL ASSESSMENT

    drawSectionTitle(doc, "Overall Assessment");

    drawInfoCard(
        doc,
        "Overall Severity",
        reportData.overallSeverity
    );

    drawInfoCard(
        doc,
        "Risk Score",
        reportData.riskScore
    );

    drawInfoCard(
        doc,
        "Average Confidence",
        `${reportData.averageConfidence}%`
    );

    drawInfoCard(
        doc,
        "Inspection Status",
        reportData.inspectionStatus
    );

    // RECOMMENDATIONS

    drawSectionTitle(doc, "Recommendations");

    drawRecommendations(
        doc,
        reportData.recommendations
    );

    nextPage(doc, 1, reportData.reportCode);
    // PAGE 2
    drawSectionTitle(doc, "AI Analysis Details");
    drawInfoCard(
        doc,
        "Total Images",
        String(reportData.totalImages)
    );

    drawInfoCard(
        doc,
        "Detected Cracks",
        String(reportData.cracks.length)
    );

    drawInfoCard(
        doc,
        "Average Confidence",
        `${reportData.averageConfidence}%`
    );

    drawInfoCard(
        doc,
        "Overall Severity",
        reportData.overallSeverity
    );

    drawSectionTitle(doc, "Crack Detection Summary");
    doc
        .fillColor(PRIMARY)
        .rect(50, doc.y, 495, 25)
        .fill();

    const tableY = doc.y;

    doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(10);

    doc.text("ID", 60, tableY + 8);

    doc.text("Type", 120, tableY + 8);

    doc.text("Severity", 250, tableY + 8);

    doc.text("Confidence", 350, tableY + 8);

    doc.text("Status", 470, tableY + 8);

    doc.y = tableY + 30;

    (reportData.cracks || []).forEach((crack, index) => {

        const rowY = doc.y;
        if (rowY > 700) {

            nextPage(doc, 2, reportData.reportCode);

            drawSectionTitle(doc, "Crack Detection Summary (Continued)");

            doc
                .fillColor(PRIMARY)
                .rect(50, doc.y, 495, 25)
                .fill();

            const headerY = doc.y;

            doc
                .fillColor("white")
                .font("Helvetica-Bold")
                .fontSize(10);

            doc.text("ID", 60, headerY + 8);

            doc.text("Type", 120, headerY + 8);

            doc.text("Severity", 250, headerY + 8);

            doc.text("Confidence", 350, headerY + 8);

            doc.text("Status", 470, headerY + 8);

            doc.y = headerY + 30;
            rowY = doc.y;
        }

        if (index % 2 === 0) {

            doc
                .rect(50, rowY, 495, 22)
                .fill("#F9FAFB");

        }

        doc
            .fillColor(TEXT)
            .font("Helvetica")
            .fontSize(10);

        doc.text(
            crack.crackId || "-",
            60,
            rowY + 6
        );

        doc.text(
            crack.crackClass || "-",
            120,
            rowY + 6
        );

        doc.text(
            crack.severity || "-",
            250,
            rowY + 6
        );

        doc.text(
            `${crack.confidence}%`,
            350,
            rowY + 6
        );

        doc.text(
            crack.validationStatus || "-",
            470,
            rowY + 6
        );

        doc.y = rowY + 22;

    });
    //PAGE 3
    nextPage(doc, 2, reportData.reportCode);
    drawSectionTitle(doc, "AI Validation Summary");
    const cracks = reportData.cracks || [];
    const totalAI = cracks.filter(
        c => c.source === "AI"
    ).length;

    const manualAdded = cracks.filter(
        c => c.source === "Manual"
    ).length;

    const validated = cracks.filter(
        c => c.validationStatus === "Validated"
    ).length;

    const edited = cracks.filter(
        c => c.validationStatus === "Edited"
    ).length;

    const removed = cracks.filter(
        c => c.validationStatus === "Removed"
    ).length;

    const finalVerified =
        cracks.filter(
            c => c.validationStatus !== "Removed"
        ).length;

    drawInfoCard(
        doc,
        "AI Detected Cracks",
        totalAI
    );

    drawInfoCard(
        doc,
        "Engineer Validated",
        validated
    );

    drawInfoCard(
        doc,
        "Engineer Edited",
        edited
    );

    drawInfoCard(
        doc,
        "Engineer Removed",
        removed
    );

    drawInfoCard(
        doc,
        "Engineer Added",
        manualAdded
    );

    drawInfoCard(
        doc,
        "Final Verified Cracks",
        finalVerified
    );

    drawSectionTitle(
        doc,
        "Validation Conclusion"
    );

    doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor(TEXT)
        .text(
            "All AI-generated crack detections were reviewed by an authorised engineer. Any incorrect detections were removed, inaccurate severity levels were updated where necessary, and additional manual crack observations were included. The final inspection report therefore represents the engineer's verified assessment of the inspected infrastructure.",
            {
                align: "justify"
            }
        );

    const notes = cracks.filter(
        c => c.reviewComments
    );
    if (notes.length) {

        drawSectionTitle(
            doc,
            "Engineer Review Notes"
        );

        notes.forEach(crack => {

            doc
                .font("Helvetica-Bold")
                .text(
                    crack.crackId
                );

            doc
                .font("Helvetica")
                .text(
                    crack.reviewComments
                );

            doc.moveDown(.5);

        });

    }

    drawSectionTitle(
        doc,
        "Approval"
    );

    doc.moveDown();

    doc.text(
        "Engineer Signature: ________________________"
    );

    doc.moveDown();

    doc.text(
        "Name: ________________________"
    );

    doc.moveDown();

    doc.text(
        "Date: ________________________"
    );

    drawFooter(doc, 3);
    doc.end();

    return new Promise((resolve, reject) => {
        stream.on("finish", () => {
            resolve({
                fileName,
                filePath,
            });
        });
        stream.on("error", reject);
    });
};

module.exports = generateReportPDF;