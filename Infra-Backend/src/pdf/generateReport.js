const PdfPrinter = require("pdfmake/src/printer");
const fonts = require("./fonts");
const createDocumentDefinition = require("./documentDefinition");

const printer = new PdfPrinter(fonts);

/* Generates the report PDF fully in memory and returns it as a Buffer.*/
const generateReportPDF = (reportData) =>
    new Promise((resolve, reject) => {
        try {
            const fileName = `${reportData.reportCode}.pdf`;

            const documentDefinition = createDocumentDefinition(
                JSON.parse(JSON.stringify(reportData))
            );

            documentDefinition.defaultStyle = {
                font: "Roboto",
            };

            const pdfDoc = printer.createPdfKitDocument(documentDefinition);

            const chunks = [];

            pdfDoc.on("data", (chunk) => chunks.push(chunk));
            pdfDoc.on("end", () =>
                resolve({
                    fileName,
                    buffer: Buffer.concat(chunks),
                })
            );
            pdfDoc.on("error", reject);

            pdfDoc.end();
        } catch (error) {
            reject(error);
        }
    });

module.exports = generateReportPDF;