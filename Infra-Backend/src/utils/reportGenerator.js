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

    // Helper function to draw header
    const drawHeader = () => {
        const y = doc.y;

        // Header background
        doc.rect(50, y, 495, 80)
            .fillAndStroke("#1E3A8A", "#1E3A8A");

        // Company name
        doc.fillColor("white")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text("InfraCrackNet", 70, y + 15, {
                width: 300,
                align: "left"
            });

        // Report title
        doc.fontSize(11)
            .font("Helvetica")
            .text("AI-Assisted Infrastructure Inspection Report", 70, y + 42, {
                width: 300,
                align: "left"
            });

        // Report code box
        doc.rect(380, y + 15, 150, 50)
            .fillAndStroke("white", "#1E3A8A");

        doc.fillColor("#1E3A8A")
            .fontSize(9)
            .font("Helvetica-Bold")
            .text("REPORT CODE", 390, y + 22, {
                width: 130,
                align: "center"
            });

        doc.fontSize(12)
            .font("Helvetica")
            .text(reportData.reportCode, 390, y + 36, {
                width: 130,
                align: "center"
            });

        // Reset position
        doc.y = y + 80;
        doc.fillColor("black");
        doc.font("Helvetica");
    };

    // Helper function to draw footer
    const drawFooter = (pageNumber, totalPages) => {
        const y = doc.page.height - 50;

        doc.rect(50, y, 495, 40)
            .fill("#1E3A8A")
            .opacity(0.1);
        doc.opacity(1);

        // Footer line
        doc.strokeColor("#1E3A8A")
            .lineWidth(1)
            .moveTo(50, y + 5)
            .lineTo(545, y + 5)
            .stroke();

        doc.fillColor("#1E3A8A")
            .fontSize(9)
            .font("Helvetica");

        // Left: Generated Date
        doc.text(`Generated: ${new Date().toLocaleString()}`, 60, y + 12, {
            width: 200,
            align: "left"
        });

        // Center: Confidential
        doc.font("Helvetica-Bold")
            .text("CONFIDENTIAL", 247, y + 12, {
                width: 100,
                align: "center"
            });
        doc.font("Helvetica");

        // Right: Page number
        doc.text(`Page ${pageNumber} of ${totalPages}`, 410, y + 12, {
            width: 120,
            align: "right"
        });
    };

    // Helper function for section titles
    const drawSectionTitle = (title, y) => {
        const currentY = y || doc.y;

        // Blue bar indicator
        doc.rect(50, currentY + 5, 5, 20)
            .fill("#1E3A8A");

        // Title text
        doc.fillColor("#1E3A8A")
            .fontSize(16)
            .font("Helvetica-Bold")
            .text(title, 65, currentY, {
                width: 430,
                align: "left"
            });

        // Separator line
        doc.strokeColor("#1E3A8A")
            .lineWidth(1)
            .moveTo(50, currentY + 30)
            .lineTo(545, currentY + 30)
            .stroke();

        doc.fillColor("black");
        doc.font("Helvetica");

        return currentY + 35;
    };

    // Helper function for rounded info boxes
    const drawInfoBox = (text, y, color = "#F3F4F6") => {
        const boxY = y;
        doc.roundedRect(50, boxY, 495, 30, 5)
            .fill(color);
        doc.fillColor("black")
            .fontSize(11)
            .text(text, 60, boxY + 8, {
                width: 475,
                align: "left"
            });
        return boxY + 30;
    };

    // Helper function for status card
    const drawStatusCard = (label, value, color, y) => {
        const cardWidth = 115;
        const cardHeight = 50;
        const x = 50 + (495 - (cardWidth * 4 + 15)) / 2;
        const cardX = x + (cardWidth + 5) * (label === "Overall Severity" ? 0 :
            label === "Risk Score" ? 1 :
                label === "Average Confidence" ? 2 : 3);

        // Card background
        doc.roundedRect(cardX, y, cardWidth, cardHeight, 5)
            .fill(color);

        // Label
        doc.fillColor("white")
            .fontSize(8)
            .font("Helvetica-Bold")
            .text(label, cardX + 5, y + 8, {
                width: cardWidth - 10,
                align: "center"
            });

        // Value
        doc.fontSize(16)
            .font("Helvetica-Bold")
            .text(value, cardX + 5, y + 24, {
                width: cardWidth - 10,
                align: "center"
            });

        doc.fillColor("black");
        doc.font("Helvetica");
    };

    // Helper function to draw table
    const drawTable = (headers, rows, startY, columnWidths = null) => {
        const y = startY;
        const x = 50;
        const tableWidth = 495;
        const rowHeight = 25;
        const headerHeight = 30;

        if (!columnWidths) {
            const colWidth = tableWidth / headers.length;
            columnWidths = Array(headers.length).fill(colWidth);
        }

        // Table header
        doc.rect(x, y, tableWidth, headerHeight)
            .fill("#1E3A8A");

        let currentX = x;
        headers.forEach((header, i) => {
            doc.fillColor("white")
                .fontSize(10)
                .font("Helvetica-Bold")
                .text(header, currentX + 5, y + 8, {
                    width: columnWidths[i] - 10,
                    align: "left"
                });
            currentX += columnWidths[i];
        });

        let currentY = y + headerHeight;

        // Table rows
        rows.forEach((row, rowIndex) => {
            const fillColor = rowIndex % 2 === 0 ? "#F9FAFB" : "white";
            doc.rect(x, currentY, tableWidth, rowHeight)
                .fill(fillColor);

            currentX = x;
            row.forEach((cell, cellIndex) => {
                doc.fillColor("black")
                    .fontSize(9)
                    .font(cellIndex === 0 ? "Helvetica-Bold" : "Helvetica")
                    .text(cell, currentX + 5, currentY + 6, {
                        width: columnWidths[cellIndex] - 10,
                        align: "left"
                    });
                currentX += columnWidths[cellIndex];
            });

            // Row border
            doc.strokeColor("#E5E7EB")
                .lineWidth(0.5)
                .moveTo(x, currentY)
                .lineTo(x + tableWidth, currentY)
                .stroke();

            currentY += rowHeight;
        });

        // Bottom border
        doc.strokeColor("#1E3A8A")
            .lineWidth(1)
            .moveTo(x, currentY)
            .lineTo(x + tableWidth, currentY)
            .stroke();

        return currentY;
    };

    // Helper for callout box
    const drawCalloutBox = (text, y, title = null) => {
        const boxY = y;

        // Border
        doc.roundedRect(50, boxY, 495, 35 + (title ? 15 : 0), 5)
            .stroke("#1E3A8A", 1.5);

        if (title) {
            doc.fillColor("#1E3A8A")
                .fontSize(10)
                .font("Helvetica-Bold")
                .text(title, 60, boxY + 5, {
                    width: 475,
                    align: "left"
                });
            doc.fillColor("black")
                .fontSize(10)
                .font("Helvetica")
                .text(text, 60, boxY + 22, {
                    width: 475,
                    align: "left"
                });
        } else {
            doc.fillColor("black")
                .fontSize(10)
                .font("Helvetica")
                .text(text, 60, boxY + 10, {
                    width: 475,
                    align: "left"
                });
        }

        return boxY + 35 + (title ? 15 : 0) + 10;
    };

    // Count pages needed
    let totalPages = 3; // Base pages

    // PAGE 1
    let y = 50;
    drawHeader();
    y += 10;

    // Report Information
    y = drawSectionTitle("Report Information", y);
    y += 5;

    doc.fontSize(11)
        .font("Helvetica")
        .fillColor("#4B5563")
        .text(`Analysis Code: ${reportData.analysisCode}`, 60, y);
    y = doc.y + 5;
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 60, y);
    y = doc.y + 15;

    // Executive Summary
    y = drawSectionTitle("Executive Summary", y);
    y += 5;

    doc.fontSize(11)
        .font("Helvetica")
        .fillColor("#374151")
        .text(reportData.executiveSummary ||
            "This report presents the results of an AI-assisted infrastructure inspection. Crack detections were produced by the AI analysis engine and subsequently reviewed and validated by an authorised engineer before the final report was generated.",
            {
                align: "justify",
                width: 475,
                indent: 20
            });
    y = doc.y + 15;

    // Project & Inspection Information (2 columns)
    const col1X = 50;
    const col2X = 300;
    const colWidth = 245;

    y = drawSectionTitle("Project Information", y);
    y += 5;

    doc.fontSize(11)
        .font("Helvetica")
        .fillColor("#374151");

    doc.text(`Project Name: ${reportData.projectName}`, col1X, y, { width: colWidth });
    doc.text(`Project Code: ${reportData.projectCode}`, col1X, doc.y + 5, { width: colWidth });
    doc.text(`Structure Type: ${reportData.structureType}`, col1X, doc.y + 5, { width: colWidth });
    doc.text(`Location: ${reportData.location}`, col1X, doc.y + 5, { width: colWidth });
    doc.text(`Priority: ${reportData.priority}`, col1X, doc.y + 5, { width: colWidth });
    y = doc.y + 10;

    y = drawSectionTitle("Inspection Information", y);
    y += 5;

    doc.text(`Inspection Code: ${reportData.inspectionCode}`, col2X, y, { width: colWidth });
    doc.text(`Inspection Type: ${reportData.inspectionType}`, col2X, doc.y + 5, { width: colWidth });
    doc.text(`Inspection Date: ${reportData.inspectionDate}`, col2X, doc.y + 5, { width: colWidth });
    doc.text(`Structure Area: ${reportData.structureArea}`, col2X, doc.y + 5, { width: colWidth });
    doc.text(`Weather: ${reportData.weather}`, col2X, doc.y + 5, { width: colWidth });
    doc.text(`GPS Location: ${reportData.gpsLocation}`, col2X, doc.y + 5, { width: colWidth });
    y = Math.max(doc.y, y) + 10;

    // Overall Assessment
    y = drawSectionTitle("Overall Assessment", y);
    y += 10;

    // Status cards
    const cardY = y;
    const colors = {
        "Critical": "#DC2626",
        "High": "#F59E0B",
        "Medium": "#FCD34D",
        "Low": "#10B981",
        "Passed": "#10B981",
        "Pending": "#F59E0B",
        "Failed": "#DC2626"
    };

    const getColor = (value, defaultColor = "#6B7280") => {
        if (typeof value === 'string' && colors[value]) return colors[value];
        return defaultColor;
    };

    drawStatusCard("Overall Severity", reportData.overallSeverity || "N/A",
        getColor(reportData.overallSeverity, "#6B7280"), cardY);
    drawStatusCard("Risk Score", reportData.riskScore || "N/A",
        getColor(reportData.riskScore, "#6B7280"), cardY);
    drawStatusCard("Average Confidence", `${reportData.averageConfidence || 0}%`,
        reportData.averageConfidence > 80 ? "#10B981" :
            reportData.averageConfidence > 60 ? "#F59E0B" : "#DC2626", cardY);
    drawStatusCard("Inspection Status", reportData.inspectionStatus || "Pending",
        getColor(reportData.inspectionStatus, "#6B7280"), cardY);
    y = cardY + 60;

    // Recommendations
    y = drawSectionTitle("Recommendations", y);
    y += 5;

    if (reportData.recommendations && reportData.recommendations.length > 0) {
        reportData.recommendations.forEach((item, index) => {
            y = drawCalloutBox(item, y, `Recommendation ${index + 1}`);
        });
    }

    drawFooter(1, totalPages);

    // PAGE 2
    doc.addPage();
    y = 50;
    drawHeader();
    y += 10;

    // AI Analysis Details
    y = drawSectionTitle("AI Analysis Details", y);
    y += 10;

    // AI stats in info boxes
    const stats = [
        [`Total Images: ${reportData.totalImages || 0}`],
        [`Total Detected Cracks: ${reportData.cracks ? reportData.cracks.length : 0}`],
        [`Average Confidence: ${reportData.averageConfidence || 0}%`],
        [`Overall Severity: ${reportData.overallSeverity || "N/A"}`],
        [`Risk Score: ${reportData.riskScore || "N/A"}`]
    ];

    stats.forEach(stat => {
        y = drawInfoBox(stat[0], y + 5, "#EFF6FF");
    });
    y += 10;

    // Crack Detection Summary
    y = drawSectionTitle("Crack Detection Summary", y);
    y += 10;

    if (reportData.cracks && reportData.cracks.length > 0) {
        const headers = ["ID", "Type", "Severity", "Confidence", "Status"];
        const rows = reportData.cracks.map(crack => [
            crack.crackId || "N/A",
            crack.crackClass || "N/A",
            crack.severity || "N/A",
            `${crack.confidence || 0}%`,
            crack.validationStatus || "Pending"
        ]);

        y = drawTable(headers, rows, y, [80, 110, 90, 95, 120]);
    }

    drawFooter(2, totalPages);

    // PAGE 3
    doc.addPage();
    y = 50;
    drawHeader();
    y += 10;

    // AI vs Human Validation
    y = drawSectionTitle("AI vs Human Validation", y);
    y += 15;

    // Validation workflow cards
    const totalAI = reportData.cracks ? reportData.cracks.filter(
        crack => crack.source === "AI"
    ).length : 0;

    const manualAdded = reportData.cracks ? reportData.cracks.filter(
        crack => crack.source === "Manual"
    ).length : 0;

    const validated = reportData.cracks ? reportData.cracks.filter(
        crack => crack.validationStatus === "Validated"
    ).length : 0;

    const edited = reportData.cracks ? reportData.cracks.filter(
        crack => crack.validationStatus === "Edited"
    ).length : 0;

    const removed = reportData.cracks ? reportData.cracks.filter(
        crack => crack.validationStatus === "Removed"
    ).length : 0;

    const finalVerified = reportData.cracks ? reportData.cracks.filter(
        crack => crack.validationStatus !== "Removed"
    ).length : 0;

    // Workflow visualization
    const workflowY = y;
    const boxWidth = 145;
    const arrowWidth = 20;
    const totalWidth = boxWidth * 3 + arrowWidth * 2;
    const startX = 50 + (495 - totalWidth) / 2;

    // AI Detection box
    doc.roundedRect(startX, workflowY, boxWidth, 60, 8)
        .fill("#1E3A8A");
    doc.fillColor("white")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("AI Detection", startX + 10, workflowY + 10, {
            width: boxWidth - 20,
            align: "center"
        });
    doc.fontSize(16)
        .text(`${totalAI} Cracks`, startX + 10, workflowY + 32, {
            width: boxWidth - 20,
            align: "center"
        });

    // Arrow
    doc.fillColor("#1E3A8A")
        .fontSize(20)
        .text("↓", startX + boxWidth + 5, workflowY + 18, {
            width: arrowWidth,
            align: "center"
        });

    // Engineer Validation box
    doc.roundedRect(startX + boxWidth + arrowWidth, workflowY, boxWidth, 60, 8)
        .fill("#F59E0B");
    doc.fillColor("white")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Engineer Validation", startX + boxWidth + arrowWidth + 10, workflowY + 10, {
            width: boxWidth - 20,
            align: "center"
        });
    doc.fontSize(11)
        .text(`✓ ${validated} Validated   ✎ ${edited} Edited   ✗ ${removed} Removed`,
            startX + boxWidth + arrowWidth + 10, workflowY + 32, {
            width: boxWidth - 20,
            align: "center"
        });

    // Arrow
    doc.fillColor("#1E3A8A")
        .fontSize(20)
        .text("↓", startX + (boxWidth + arrowWidth) * 2 + 5, workflowY + 18, {
            width: arrowWidth,
            align: "center"
        });

    // Final Verified Result box
    doc.roundedRect(startX + (boxWidth + arrowWidth) * 2, workflowY, boxWidth, 60, 8)
        .fill("#10B981");
    doc.fillColor("white")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Final Verified Result", startX + (boxWidth + arrowWidth) * 2 + 10, workflowY + 10, {
            width: boxWidth - 20,
            align: "center"
        });
    doc.fontSize(16)
        .text(`${finalVerified} Cracks`, startX + (boxWidth + arrowWidth) * 2 + 10, workflowY + 32, {
            width: boxWidth - 20,
            align: "center"
        });

    y = workflowY + 70;

    // Engineer Review Notes
    y = drawSectionTitle("Engineer Review Notes", y);
    y += 5;

    const hasNotes = reportData.cracks && reportData.cracks.some(
        crack => crack.reviewComments
    );

    if (hasNotes) {
        doc.fontSize(10)
            .font("Helvetica")
            .fillColor("#374151");

        reportData.cracks.forEach((crack) => {
            if (crack.reviewComments) {
                doc.text(`${crack.crackId || "N/A"}:`, 60, y);
                doc.text(crack.reviewComments, 120, y, {
                    width: 425,
                    align: "left"
                });
                y = doc.y + 5;
            }
        });
        y += 5;
    }

    // Comparison table
    y = drawSectionTitle("AI vs Human Comparison Table", y);
    y += 10;

    const compHeaders = ["Crack ID", "Source", "AI Severity", "Human Severity", "Status"];
    const compRows = reportData.cracks ? reportData.cracks.map(crack => [
        crack.crackId || "N/A",
        crack.source || "N/A",
        crack.severity || "-",
        crack.reviewedSeverity || "-",
        crack.validationStatus || "Pending"
    ]) : [];

    y = drawTable(compHeaders, compRows, y, [80, 90, 100, 110, 115]);
    y += 10;

    // Validation Conclusion
    y = drawSectionTitle("Validation Conclusion", y);
    y += 5;

    doc.fontSize(11)
        .font("Helvetica")
        .fillColor("#374151")
        .text("All AI-generated crack detections were reviewed by an authorised engineer. The final report contains only validated and manually verified crack records, ensuring the inspection results accurately represent the engineer's final assessment.",
            {
                align: "justify",
                width: 475,
                indent: 20
            });

    drawFooter(3, totalPages);

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