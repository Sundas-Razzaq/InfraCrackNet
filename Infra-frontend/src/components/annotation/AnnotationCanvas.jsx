const AnnotationCanvas = ({
    image,
    cracks = [],
    selectedCrack,
    onSelectCrack,
}) => {

    if (!image) {
        return (
            <div className="annotation-canvas empty">
                <p>No image selected.</p>
            </div>
        );
    }

    const imageCracks = cracks.filter(
        (crack) =>
            crack.inspectionImage?._id === image._id
    );

    return (
        <div className="annotation-canvas">

            <div className="canvas-header">

                <div>

                    <h3>Annotation Canvas</h3>

                    <p>{image.originalFileName}</p>

                </div>

                <span>
                    {imageCracks.length} Crack
                    {imageCracks.length !== 1 && "s"}
                </span>

            </div>

            <div className="canvas-wrapper">

                <img
                    src={image.imageUrl}
                    alt={image.originalFileName}
                    className="annotation-image"
                />

                {imageCracks.map((crack) => {

                    const active =
                        selectedCrack?._id === crack._id;

                    return (
                        <button
                            key={crack._id}
                            type="button"
                            className={`bounding-box ${active
                                ? "active"
                                : ""
                                }`}
                            style={{
                                left: `${crack.boundingBox.x}%`,
                                top: `${crack.boundingBox.y}%`,
                                width: `${crack.boundingBox.width}%`,
                                height: `${crack.boundingBox.height}%`,
                            }}
                            onClick={() =>
                                onSelectCrack(crack)
                            }
                        >

                            <span className="box-label">

                                {crack.crackId}

                                {" • "}

                                {crack.severity}

                            </span>

                        </button>
                    );

                })}

            </div>

        </div>
    );
};

export default AnnotationCanvas;