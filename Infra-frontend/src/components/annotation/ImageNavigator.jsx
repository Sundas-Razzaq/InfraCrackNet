const ImageNavigator = ({
    images = [],
    selectedImage,
    onSelectImage,
}) => {
    if (images.length === 0) {
        return (
            <div className="image-navigator">
                <p>No inspection images available.</p>
            </div>
        );
    }

    const currentIndex = images.findIndex(
        (image) => image._id === selectedImage?._id
    );

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onSelectImage(images[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            onSelectImage(images[currentIndex + 1]);
        }
    };

    return (
        <div className="image-navigator">

            <div className="navigator-header">

                <h3>Inspection Images</h3>

                <span>
                    {currentIndex + 1} / {images.length}
                </span>

            </div>

            <div className="navigator-buttons">

                <button
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={handleNext}
                    disabled={
                        currentIndex === images.length - 1
                    }
                >
                    Next
                </button>

            </div>

            <div className="thumbnail-list">

                {images.map((image, index) => (

                    <button
                        key={image._id}
                        type="button"
                        className={`thumbnail-card ${selectedImage?._id === image._id
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            onSelectImage(image)
                        }
                    >

                        <img
                            src={image.imageUrl}
                            alt={image.originalFileName}
                        />

                        <div className="thumbnail-overlay">

                            <span>
                                Image {index + 1}
                            </span>

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
};

export default ImageNavigator;