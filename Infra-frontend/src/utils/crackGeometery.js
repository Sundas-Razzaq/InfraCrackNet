// Shared helpers for drawing / listing ML-detected cracks.

// Per-crack severity colours: Low green, Medium orange, High red.
export const SEVERITY_COLORS = {
    Low: "#22c55e",
    Medium: "#f97316",
    High: "#ef4444",
    Critical: "#7f1d1d",
};

export const severityColor = (severity) =>
    SEVERITY_COLORS[severity] || SEVERITY_COLORS.Low;

/** "#1", "#2" ... (ML crack_id, falling back to position in the image). */
export const crackLabel = (crack, index = 0) =>
    `#${crack.mlCrackId ?? index + 1}`;

/**
 * Resolve where a crack lives on an image, as a bbox + polygons in the
 * coordinate space of `space` ({ width, height }).
 *  - ML detections store pixels of the original image (imageWidth/imageHeight)
 *  - Manual cracks (added in the annotation page) store percentages (0-100)
 *  - Legacy / simulated detections have no image size: pixels of the natural size
 */
export const resolveGeometry = (crack, natural) => {
    const b = crack.boundingBox || { x: 0, y: 0, width: 0, height: 0 };
    const polygons = Array.isArray(crack.polygons) ? crack.polygons : [];

    if (crack.imageWidth && crack.imageHeight) {
        return {
            space: { width: crack.imageWidth, height: crack.imageHeight },
            box: b,
            polygons,
        };
    }

    if (crack.source === "Manual") {
        const space = { width: 100, height: 100 };
        return { space, box: b, polygons: [] };
    }

    const space = {
        width: natural?.width || 1,
        height: natural?.height || 1,
    };
    return { space, box: b, polygons };
};

/**
 * Convert a bbox to CSS percentages (annotation canvas overlay).
 * ML boxes are pixels of imageWidth x imageHeight; manual / legacy boxes were
 * already stored as percentages, so they pass through unchanged.
 */
export const boxToPercentStyle = (crack) => {
    const b = crack.boundingBox || { x: 0, y: 0, width: 0, height: 0 };
    if (!(crack.imageWidth && crack.imageHeight)) {
        return {
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.width}%`,
            height: `${b.height}%`,
        };
    }
    return {
        left: `${(b.x / crack.imageWidth) * 100}%`,
        top: `${(b.y / crack.imageHeight) * 100}%`,
        width: `${(b.width / crack.imageWidth) * 100}%`,
        height: `${(b.height / crack.imageHeight) * 100}%`,
    };
};

/** points string for an SVG <polygon>. */
export const ringToPoints = (ring) => ring.map((p) => `${p[0]},${p[1]}`).join(" ");

/**
 * Build the list of images shown on the results page.
 * Prefers analysis.imageResults (includes images with no cracks); falls back
 * to grouping cracks by image for older analyses.
 */
export const buildImageList = (cracks = [], imageResults = []) => {
    const byImage = new Map();
    cracks.forEach((c) => {
        const id = c.inspectionImage?._id;
        if (!id) return;
        if (!byImage.has(id)) byImage.set(id, []);
        byImage.get(id).push(c);
    });

    if (imageResults.length > 0) {
        return imageResults.map((r) => {
            const id = String(r.inspectionImage);
            return {
                _id: id,
                imageUrl: r.imageUrl,
                originalFileName: r.originalFileName,
                result: r,
                cracks: byImage.get(id) || [],
            };
        });
    }

    return [...byImage.entries()].map(([id, list]) => ({
        _id: id,
        imageUrl: list[0].inspectionImage.imageUrl,
        originalFileName: list[0].inspectionImage.originalFileName,
        result: null,
        cracks: list,
    }));
};

export const fmtPx = (v, digits = 1) =>
    v === null || v === undefined ? "—" : `${Number(v).toFixed(digits)} px`;
