const generateRecommendations = (
    severity,
    riskScore
) => {
    const recommendations = [];

    switch (severity) {
        case "Critical":
            recommendations.push(
                "Immediate structural inspection is recommended."
            );
            recommendations.push(
                "Restrict public access until repairs are completed."
            );
            break;

        case "High":
            recommendations.push(
                "Schedule repairs as soon as possible."
            );
            recommendations.push(
                "Increase inspection frequency."
            );
            break;

        case "Medium":
            recommendations.push(
                "Monitor crack progression."
            );
            recommendations.push(
                "Plan preventive maintenance."
            );
            break;

        default:
            recommendations.push(
                "Continue routine inspections."
            );
    }

    if (riskScore >= 90) {
        recommendations.push(
            "Risk level is extremely high."
        );
    }

    return recommendations;
};

module.exports = generateRecommendations;