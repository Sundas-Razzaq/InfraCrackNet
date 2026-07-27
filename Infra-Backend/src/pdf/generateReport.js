const fs = require("fs");
const path = require("path");

const PdfPrinter = require("pdfmake/src/printer");
const fonts = require("./fonts");
const createDocumentDefinition = require("./documentDefinition");

const printer = new PdfPrinter(fonts);

const generateReportPDF = async (reportData) => {

    const reportsDir = path.join(__dirname, "../reports");

    if (!fs.existsSync(reportsDir)) {

        fs.mkdirSync(reportsDir, {
            recursive: true,
        });

    }

    const fileName = `${reportData.reportCode}.pdf`;

    const filePath = path.join(
        reportsDir,
        fileName
    );

    const documentDefinition = createDocumentDefinition(
        JSON.parse(JSON.stringify(reportData)));

    documentDefinition.defaultStyle = {
        font: "Roboto",
    };

    const pdfDoc =
        printer.createPdfKitDocument(
            documentDefinition
        );

    const stream =
        fs.createWriteStream(filePath);

    pdfDoc.pipe(stream);

    pdfDoc.end();

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