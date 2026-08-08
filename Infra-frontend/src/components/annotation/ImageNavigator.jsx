const ImageNavigator = ({
    images = [],
    cracks = [],
    selectedImage,
    onSelectImage,
}) => {
    if (images.length === 0) {
        return (
            <div className="image-navigator empty">
                <p>No inspection images available.</p>
            </div>
        );
    }

    const currentIndex = images.findIndex(
        (image) =>
            image._id === selectedImage?._id
    );

    const activeIndex =
        currentIndex === -1 ? 0 : currentIndex;

    const currentImage = images[activeIndex];

    const getImageCracks = (imageId) =>
        cracks.filter(
            (crack) =>
                crack.inspectionImage?._id ===
                imageId ||
                crack.inspectionImage === imageId
        );

    const getReviewedCount = (imageId) =>
        getImageCracks(imageId).filter(
            (crack) =>
                crack.reviewStatus === "Completed"
        ).length;

    const handlePrevious = () => {
        if (activeIndex > 0) {
            onSelectImage(
                images[activeIndex - 1]
            );
        }
    };

    const handleNext = () => {
        if (activeIndex < images.length - 1) {
            onSelectImage(
                images[activeIndex + 1]
            );
        }
    };

    return (
        <div className="image-navigator">

            <div className="navigator-header">

                <div>
                    <h3>
                        Inspection Images
                    </h3>

                    <span>
                        Image {activeIndex + 1} of{" "}
                        {images.length}
                    </span>
                </div>

                <span>
                    {getImageCracks(
                        currentImage._id
                    ).length}{" "}
                    Crack
                    {getImageCracks(
                        currentImage._id
                    ).length !== 1 && "s"}
                </span>

            </div>

            <div className="navigator-buttons">

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={activeIndex === 0}
                >
                    Previous
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleNext}
                    disabled={
                        activeIndex ===
                        images.length - 1
                    }
                >
                    Next
                </button>

            </div>

            <div className="thumbnail-list">

                {images.map(
                    (image, index) => {

                        const imageCracks =
                            getImageCracks(
                                image._id
                            );

                        const crackCount =
                            imageCracks.length;

                        const reviewedCount =
                            getReviewedCount(
                                image._id
                            );

                        const isActive =
                            selectedImage?._id ===
                            image._id;

                        return (
                            <button
                                key={image._id}
                                type="button"
                                className={`thumbnail-card ${isActive
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    onSelectImage(
                                        image
                                    )
                                }
                            >

                                <img
                                    src={
                                        image.imageUrl
                                    }
                                    alt={
                                        image.originalFileName
                                    }
                                />

                                <div className="thumbnail-overlay">

                                    <span>
                                        Image{" "}
                                        {index + 1}
                                    </span>

                                </div>

                                <div className="thumbnail-info">

                                    <span>
                                        {crackCount}{" "}
                                        Crack
                                        {crackCount !==
                                            1 &&
                                            "s"}
                                    </span>

                                    <span>
                                        {
                                            reviewedCount
                                        }{" "}
                                        Reviewed
                                    </span>

                                </div>

                            </button>
                        );
                    }
                )}

            </div>

        </div>
    );
};

export default ImageNavigator;