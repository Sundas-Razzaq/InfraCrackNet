const Inspection = require("../models/inspection.model");

const generateInspectionCode = async () => {
    const latestInspection = await Inspection.findOne()
        .sort({ createdAt: -1 })
        .select("inspectionCode");

    if (!latestInspection) {
        return "INS-001";
    }

    const latestNumber = parseInt(
        latestInspection.inspectionCode.split("-")[1],
        10
    );

    const nextNumber = latestNumber + 1;

    return `INS-${String(nextNumber).padStart(3, "0")}`;
};

module.exports = generateInspectionCode;