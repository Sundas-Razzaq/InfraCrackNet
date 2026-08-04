import { useMemo, useState } from "react";

import {
    faChevronLeft,
    faChevronRight,
    faImage,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DetectionImage = ({ cracks = [] }) => {
    const images = useMemo(() => {
        const map = new Map();

        cracks.forEach((crack) => {
            const image = crack.inspectionImage;

            if (!image) return;

            if (!map.has(image._id)) {
                map.set(image._id, {
                    ...image,
                    cracks: [],
                });
            }

            map.get(image._id).cracks.push(crack);
        });

        return [...map.values()];
    }, [cracks]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    if (images.length === 0) {
        return (
            <div className="detection-image-card">

                <div className="detection-empty">

                    <FontAwesomeIcon
                        icon={faImage}
                    />

                    <p>
                        No detection images available.
                    </p>

                </div>

            </div>
        );
    }

    const activeIndex = Math.min(
        currentIndex,
        images.length - 1
    );

    const currentImage =
        images[activeIndex];

    return (
        <div className="detection-image-card">

            <div className="detection-header">

                <div>

                    <h3>Detection Preview</h3>

                    <p>
                        {currentImage.originalFileName}
                    </p>

                </div>

                <span className="image-counter">

                    {activeIndex + 1} / {images.length}

                </span>

            </div>

            <div className="detection-image-wrapper">

                <img
                    src={currentImage.imageUrl}
                    alt="Inspection"
                    className="detection-image"
                />

                {currentImage.cracks.map((crack) => (
                    <div
                        key={crack._id}
                        className={`bounding-box severity-${crack.severity.toLowerCase()}`}
                        style={{
                            left: crack.boundingBox.x,
                            top: crack.boundingBox.y,
                            width: crack.boundingBox.width,
                            height:
                                crack.boundingBox.height,
                        }}
                    >
                        <span>

                            {crack.crackId}

                        </span>
                    </div>
                ))}

            </div>

            <div className="detection-footer">

                <button
                    className="btn btn-outline"
                    disabled={activeIndex === 0}
                    onClick={() => {
                        setCurrentIndex((prev) =>
                            Math.max(prev - 1, 0)
                        );
                    }}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                    />
                </button>

                <div className="detection-summary">

                    <strong>
                        {currentImage.cracks.length}
                    </strong>

                    <span>
                        detected crack(s)
                    </span>

                </div>

                <button
                    className="btn btn-outline"
                    disabled={
                        activeIndex ===
                        images.length - 1
                    }
                    onClick={() => {
                        setCurrentIndex((prev) =>
                            Math.min(
                                prev + 1,
                                images.length - 1
                            )
                        );
                    }}
                >
                    <FontAwesomeIcon
                        icon={faChevronRight}
                    />
                </button>

            </div>

        </div>
    );
};

export default DetectionImage;