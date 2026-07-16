const Project = require("../models/project");

const generateProjectCode = async () => {
    const latestProject = await Project.findOne()
        .sort({ createdAt: -1 })
        .select("projectCode");

    if (!latestProject) {
        return "PRJ-001";
    }

    const latestNumber = parseInt(
        latestProject.projectCode.split("-")[1],
        10
    );

    const nextNumber = latestNumber + 1;

    return `PRJ-${String(nextNumber).padStart(3, "0")}`;
};

module.exports = generateProjectCode;