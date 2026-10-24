const Team = require("../models/team");

// ObjectId, string ya populated doc: sab se id string nikalta hai
const idOf = (value) => {
    if (!value) return null;
    return (value._id ?? value).toString();
};

/* Team-based access. Admin: read access. Baqi: sirf apni team ka project. */
const hasProjectAccess = (project, user) => {
    if (!project || !user) return false;
    if (user.role === "Admin") return true;
    if (!user.team) return false;

    const projectTeamId = idOf(project.team);
    return !!projectTeamId && projectTeamId === user.team;
};

/* Project.find(...) ke liye filter. Team nahi to kuch nahi dikhega. */
const getProjectScope = (user) => {
    if (user.role === "Admin") return {};
    if (user.team) return { team: user.team };
    return { _id: { $in: [] } };
};

/* Project ki team ke lead ka id. Kabhi throw nahi karta (flows na tootein). */
const getProjectLeadId = async (project) => {
    try {
        const teamId = idOf(project?.team);
        if (!teamId) return null;

        const team = await Team.findById(teamId)
            .select("engineerLead")
            .lean();

        return team?.engineerLead || null;
    } catch (error) {
        console.error("getProjectLeadId error:", error.message);
        return null;
    }
};

/* Kya ye inspection isi user ne banayi? */
const isInspectionOwner = (inspection, user) =>
    !!inspection && !!user && idOf(inspection.createdBy) === user.id;

module.exports = {
    hasProjectAccess,
    getProjectScope,
    getProjectLeadId,
    isInspectionOwner,
};