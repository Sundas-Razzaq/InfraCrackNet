import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImages,
    faPaperPlane,
    faCloudArrowUp,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import UploadedImageCard from "./UploadedImageCard";

const UploadedImagesPanel = ({
    images,
    selectedFiles,
    uploading,
    onUpload,
    onDelete,
    deletingImageId,
    onNotifyEngineer,
    notifying,
    inspectionStatus,
}) => {
    // determine whether analysis has already been requested.
    const analysisRequested = [
        "Pending Analysis",
        "AI Processing",
        "AI Completed",
        "Validated",
        "Report Generated",
        "Completed",
    ].includes(inspectionStatus);

    const canNotify =
        images.length > 0 && !notifying && !analysisRequested;

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
                                {(file.size / (1024 * 1024)).toFixed(
                                    2
                                )}{" "}
                                MB
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
                            deleting={deletingImageId === image._id}
                        />
                    ))
                )}
            </div>

            {/* notify / status footer */}
            <div className="uploaded-images-footer">
                {analysisRequested ? (
                    <div className="notify-status">
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="notify-status-icon"
                        />
                        <span>Engineer has been notified</span>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        disabled={!canNotify}
                        onClick={onNotifyEngineer}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {notifying
                            ? "Notifying..."
                            : "Notify Engineer"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadedImagesPanel;