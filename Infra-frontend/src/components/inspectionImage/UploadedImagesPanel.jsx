import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImages,
    faRobot,
    faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import UploadedImageCard from "./UploadedImageCard";

const UploadedImagesPanel = ({
    images,
    selectedFiles,
    uploading,
    onUpload,
    onDelete,
    deletingImageId,
    onRunAI,
}) => {
    return (
        <div className="uploaded-images-card">

            <div className="uploaded-images-header">
                <div>
                    <h3 className="uploaded-images-title">
                        Uploaded Images
                    </h3>

                    <p className="uploaded-images-subtitle">
                        {images.length} uploaded •{" "}
                        {selectedFiles.length} selected
                    </p>
                </div>

                <FontAwesomeIcon
                    icon={faImages}
                    className="uploaded-images-icon"
                />
            </div>

            {/* Selected files */}

            {selectedFiles.length > 0 && (
                <div className="selected-files-section">

                    <h4>Selected Files</h4>

                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="selected-file-item"
                        >
                            <span>{file.name}</span>

                            <span>
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                        </div>
                    ))}

                    <button
                        className="btn btn-primary"
                        onClick={onUpload}
                        disabled={uploading}
                    >
                        <FontAwesomeIcon icon={faCloudArrowUp} />

                        {uploading
                            ? "Uploading..."
                            : "Upload Selected Images"}
                    </button>

                </div>
            )}

            <div className="uploaded-images-content">

                {images.length === 0 ? (
                    <div className="uploaded-images-empty">

                        <FontAwesomeIcon
                            icon={faImages}
                            className="uploaded-empty-icon"
                        />

                        <h4>No Images Uploaded</h4>

                        <p>
                            Upload inspection images to begin AI crack
                            detection.
                        </p>

                    </div>
                ) : (
                    images.map((image) => (
                        <UploadedImageCard
                            key={image._id}
                            image={image}
                            onDelete={onDelete}
                            deleting={
                                deletingImageId === image._id
                            }
                        />
                    ))
                )}

            </div>

            <div className="uploaded-images-footer">
                <button
                    className="btn btn-primary"
                    disabled={images.length === 0 || uploading}
                    onClick={onRunAI}
                >
                    <FontAwesomeIcon icon={faRobot} />

                    {uploading
                        ? "Uploading Images..."
                        : "Run AI Analysis"}
                </button>

            </div>

        </div>
    );
};

export default UploadedImagesPanel;