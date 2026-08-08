import { useState } from "react";

const AnnotationCanvas = ({
    image,
    cracks = [],
    selectedCrack,
    onSelectCrack,
}) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [isDragging, setIsDragging] =
        useState(false);

    const [dragStart, setDragStart] =
        useState({
            x: 0,
            y: 0,
        });

    if (!image) {
        return (
            <div className="annotation-canvas empty">
                <p>No image selected.</p>
            </div>
        );
    }

    const imageCracks = cracks.filter(
        (crack) =>
            crack.inspectionImage?._id ===
            image._id
    );

    const handleZoomIn = () => {
        setZoom((prev) =>
            Math.min(prev + 0.25, 3)
        );
    };

    const handleZoomOut = () => {
        setZoom((prev) =>
            Math.max(prev - 0.25, 1)
        );
    };

    const handleReset = () => {
        setZoom(1);

        setPosition({
            x: 0,
            y: 0,
        });
    };

    const handleMouseDown = (event) => {
        if (zoom === 1) return;

        setIsDragging(true);

        setDragStart({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;

        setPosition({
            x: event.clientX - dragStart.x,
            y: event.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (event) => {
        if (!event.ctrlKey) return;

        event.preventDefault();

        if (event.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    return (
        <div className="annotation-canvas">

            <div className="canvas-header">

                <div>
                    <h3>
                        Annotation Canvas
                    </h3>

                    <p>
                        {image.originalFileName}
                    </p>
                </div>

                <span>
                    {imageCracks.length} Crack
                    {imageCracks.length !== 1 &&
                        "s"}
                </span>

            </div>

            <div className="canvas-toolbar">

                <div className="canvas-zoom-controls">

                    <button
                        type="button"
                        onClick={handleZoomOut}
                        disabled={zoom <= 1}
                        aria-label="Zoom out"
                    >
                        −
                    </button>

                    <span>
                        {Math.round(zoom * 100)}%
                    </span>

                    <button
                        type="button"
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        aria-label="Zoom in"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>

            </div>

            <div
                className={`canvas-wrapper ${zoom > 1 ? "zoomed" : ""
                    } ${isDragging ? "dragging" : ""
                    }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >

                <div
                    className="canvas-content"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    }}
                >

                    <img
                        src={image.imageUrl}
                        alt={image.originalFileName}
                        className="annotation-image"
                        draggable={false}
                    />

                    {imageCracks.map((crack) => {

                        const active =
                            selectedCrack?._id ===
                            crack._id;

                        const status =
                            crack.validationStatus?.toLowerCase();

                        return (
                            <button
                                key={crack._id}
                                type="button"
                                className={`bounding-box ${active
                                        ? "active"
                                        : ""
                                    } ${status
                                        ? `status-${status}`
                                        : ""
                                    }`}
                                style={{
                                    left: `${crack.boundingBox.x}%`,
                                    top: `${crack.boundingBox.y}%`,
                                    width: `${crack.boundingBox.width}%`,
                                    height: `${crack.boundingBox.height}%`,
                                }}
                                onMouseDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={() =>
                                    onSelectCrack(
                                        crack
                                    )
                                }
                            >

                                <span className="box-label">

                                    {crack.crackId}

                                    {" • "}

                                    {crack.reviewedSeverity ||
                                        crack.severity}

                                </span>

                            </button>
                        );
                    })}

                </div>

            </div>

        </div>
    );
};

export default AnnotationCanvas;