const { colors } = require("./styles");

/**
 * Creates a label/value row.
 */
const buildInfoRow = (label, value) => ({
    columns: [
        {
            text: `${label}:`,
            bold: true,
            width: 140,
        },
        {
            text:
                value !== undefined &&
                    value !== null &&
                    value !== ""
                    ? String(value)
                    : "-",
        },
    ],
    margin: [0, 2, 0, 2],
});

/**
 * Creates an information card.
 */
const buildInfoCard = (title, value) => ({
    table: {
        widths: ["*"],
        body: [
            [
                {
                    stack: [
                        {
                            text: title,
                            fontSize: 9,
                            color: "gray",
                        },
                        {
                            text:
                                value !== undefined &&
                                    value !== null &&
                                    value !== ""
                                    ? String(value)
                                    : "-",
                            fontSize: 14,
                            bold: true,
                            margin: [0, 4, 0, 0],
                        },
                    ],
                    fillColor: colors.light,
                    margin: [10, 8, 10, 8],
                },
            ],
        ],
    },
    layout: {
        hLineColor: () => colors.border,
        vLineColor: () => colors.border,
    },
    margin: [0, 0, 0, 10],
});

/**
 * Creates a bullet list of recommendations.
 */
const buildRecommendations = (recommendations = []) => {
    if (!recommendations.length) {
        return {
            text: "No recommendations available.",
        };
    }

    return {
        ul: recommendations,
    };
};

module.exports = {
    buildInfoRow,
    buildInfoCard,
    buildRecommendations,
};