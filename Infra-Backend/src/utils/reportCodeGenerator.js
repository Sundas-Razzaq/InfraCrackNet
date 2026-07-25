const Report = require("../models/report");

const generateReportCode = async () => {
    const count = await Report.countDocuments();

    return `REP-${String(count + 1).padStart(3, "0")}`;
};

module.exports = generateReportCode;