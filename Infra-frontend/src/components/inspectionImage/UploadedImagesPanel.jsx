import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImages,
    faRobot,
} from "@fortawesome/free-solid-svg-icons";

import UploadedImageCard from "./UploadedImageCard";

const UploadedImagesPanel = ({
    images = [],
    selectedFiles = [],
    onDelete,
    deletingImageId,
    onRunAI,
}) => {
    const totalImages =
        images.length + selectedFiles.length;

    return (
        <div className="uploaded-images-card">

            <div className="uploaded-images-header">

                <div>

                    <h3 className="uploaded-images-title">
                        Uploaded Images
                    </h3>

                    <p className="uploaded-images-subtitle">
                        {totalImages} image(s)
                    </p>

                </div>

                <FontAwesomeIcon
                    icon={faImages}
                    className="uploaded-images-icon"
                />

            </div>

            <div className="uploaded-images-content">

                {totalImages === 0 ? (

                    <div className="uploaded-images-empty">

                        <FontAwesomeIcon
                            icon={faImages}
                            className="uploaded-empty-icon"
                        />

                        <h4>No Images Selected</h4>

                        <p>
                            Upload inspection images to begin
                            AI crack detection.
                        </p>

                    </div>

                ) : (

                    <>
                        {/* Already uploaded images */}

                        {images.map((image) => (
                            <UploadedImageCard
                                key={image._id}
                                image={image}
                                uploaded={true}
                                onDelete={onDelete}
                                deleting={
                                    deletingImageId ===
                                    image._id
                                }
                            />
                        ))}

                        {/* Local images waiting to upload */}

                        {selectedFiles.map(
                            (file, index) => (
                                <UploadedImageCard
                                    key={`${file.name}-${index}`}
                                    image={{
                                        originalFileName:
                                            file.name,
                                        fileSize:
                                            file.size,
                                        imageUrl:
                                            URL.createObjectURL(
                                                file
                                            ),
                                        uploadStatus:
                                            "Pending",
                                    }}
                                    uploaded={false}
                                />
                            )
                        )}
                    </>

                )}

            </div>

            <div className="uploaded-images-footer">

                <button
                    className="btn btn-primary"
                    onClick={onRunAI}
                    disabled={images.length === 0}
                >
                    <FontAwesomeIcon icon={faRobot} />
                    Run AI Analysis
                </button>

            </div>

        </div>
    );
};

export default UploadedImagesPanel;