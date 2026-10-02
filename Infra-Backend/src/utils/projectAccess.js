const hasProjectAccess = (project, user) => {
    if (!project || !user) {
        return false;
    }

    if (user.role === "Admin") {
        return true;
    }

    if (
        user.role === "Engineer" &&
        project.createdBy?.toString() === user.id
    ) {
        return true;
    }

    if (
        user.role === "Inspector" &&
        project.assignedInspectors?.some(
            (inspectorId) =>
                inspectorId.toString() === user.id
        )
    ) {
        return true;
    }

    return false;
};

module.exports = {
    hasProjectAccess,
};