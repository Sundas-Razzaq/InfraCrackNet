import { useState } from "react";

import {
    faChevronLeft,
    faChevronRight,
    faImage,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    crackLabel,
    resolveGeometry,
    ringToPoints,
    severityColor,
} from "../../utils/crackGeometery";

/*
 * Draws every detected crack on the uploaded image.
 * Uses an SVG overlay whose viewBox equals the image's pixel size, so the
 * outlines stay aligned at any display size. Polygons are preferred; the
 * bounding box is used when a crack has no outline.
 */
const DetectionImage = ({
    images = [],
    activeIndex = 0,
    onChangeIndex,
    activeCrackId = null,
    onSelectCrack,
}) => {
    const [naturalSizes, setNaturalSizes] = useState({});

    if (images.length === 0) {
        return (
            <div className="detection-image-card">
                <div className="detection-empty">
                    <FontAwesomeIcon icon={faImage} />
                    <p>No detection images available.</p>
                </div>
            </div>
        );
    }

    const index = Math.min(activeIndex, images.length - 1);
    const current = images[index];
    const natural = naturalSizes[current._id];

    // Overlay coordinate space: prefer the size the ML service reported.
    const reported = current.result;
    const viewW = reported?.imageWidth || natural?.width;
    const viewH = reported?.imageHeight || natural?.height;

    return (
        <div className="detection-image-card">
            <div className="detection-header">
                <div>
                    <h3>Detection Preview</h3>
                    <p>{current.originalFileName}</p>
                </div>

                <span className="image-counter">
                    {index + 1} / {images.length}
                </span>
            </div>

            <div className="detection-image-wrapper">
                <img
                    src={current.imageUrl}
                    alt="Inspection"
                    className="detection-image"
                    onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.currentTarget;
                        setNaturalSizes((prev) => ({
                            ...prev,
                            [current._id]: { width: naturalWidth, height: naturalHeight },
                        }));
                    }}
                />

                {viewW && viewH && (
                    <svg
                        className="crack-overlay"
                        viewBox={`0 0 ${viewW} ${viewH}`}
                        preserveAspectRatio="none"
                    >
                        {current.cracks.map((crack, i) => {
                            const color = severityColor(crack.severity);
                            const { space, box, polygons } = resolveGeometry(crack, {
                                width: viewW,
                                height: viewH,
                            });
                            // map crack space -> view space (identity for ML results)
                            const sx = viewW / space.width;
                            const sy = viewH / space.height;
                            const active = activeCrackId === crack._id;
                            const strokeW = Math.max(viewW, viewH) / 400;
                            const fontSize = Math.max(viewW, viewH) / 45;
                            const hasPoly = polygons.length > 0;

                            return (
                                <g
                                    key={crack._id}
                                    className={`crack-shape ${active ? "active" : ""}`}
                                    onClick={() => onSelectCrack?.(crack._id)}
                                >
                                    {hasPoly ? (
                                        polygons.map((ring, r) => (
                                            <polygon
                                                key={r}
                                                points={ringToPoints(
                                                    ring.map((p) => [p[0] * sx, p[1] * sy])
                                                )}
                                                fill={color}
                                                fillOpacity={active ? 0.55 : 0.35}
                                                stroke={color}
                                                strokeWidth={active ? strokeW * 2 : strokeW}
                                                strokeLinejoin="round"
                                            />
                                        ))
                                    ) : (
                                        <rect
                                            x={box.x * sx}
                                            y={box.y * sy}
                                            width={box.width * sx}
                                            height={box.height * sy}
                                            fill={color}
                                            fillOpacity={active ? 0.3 : 0.15}
                                            stroke={color}
                                            strokeWidth={active ? strokeW * 2 : strokeW}
                                        />
                                    )}

                                    {/* dashed box around the crack + label */}
                                    {hasPoly && (
                                        <rect
                                            x={box.x * sx}
                                            y={box.y * sy}
                                            width={box.width * sx}
                                            height={box.height * sy}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={strokeW}
                                            strokeDasharray={`${strokeW * 4} ${strokeW * 3}`}
                                            opacity={0.8}
                                        />
                                    )}

                                    <g
                                        transform={`translate(${box.x * sx}, ${Math.max(
                                            box.y * sy - fontSize * 1.5,
                                            0
                                        )})`}
                                    >
                                        <rect
                                            width={fontSize * 2.2}
                                            height={fontSize * 1.4}
                                            rx={fontSize * 0.25}
                                            fill={color}
                                        />
                                        <text
                                            x={fontSize * 1.1}
                                            y={fontSize * 1.0}
                                            fontSize={fontSize}
                                            fontWeight="700"
                                            fill="#fff"
                                            textAnchor="middle"
                                        >
                                            {crackLabel(crack, i)}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>

            <div className="crack-legend">
                <span><i style={{ background: severityColor("Low") }} /> Low</span>
                <span><i style={{ background: severityColor("Medium") }} /> Medium</span>
                <span><i style={{ background: severityColor("High") }} /> High</span>
            </div>

            <div className="detection-footer">
                <button
                    className="btn btn-outline"
                    disabled={index === 0}
                    onClick={() => onChangeIndex?.(Math.max(index - 1, 0))}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className="detection-summary">
                    <strong>{current.cracks.length}</strong>
                    <span>detected crack(s)</span>
                </div>

                <button
                    className="btn btn-outline"
                    disabled={index === images.length - 1}
                    onClick={() =>
                        onChangeIndex?.(Math.min(index + 1, images.length - 1))
                    }
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

export default DetectionImage;
