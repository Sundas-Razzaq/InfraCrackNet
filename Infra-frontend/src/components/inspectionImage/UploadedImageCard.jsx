import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faImage,
    faVideo,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const UploadedImageCard = ({
    image,
    onDelete,
    deleting = false,
}) => {
    const displayName =
        image.originalFileName || image.name || "Untitled";

    const sizeInBytes = image.fileSize || image.size || 0;

    const sizeLabel = sizeInBytes
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
        : "Ready to upload";

    // Determine if this is a video.
    // For uploaded items: backend sets mediaType = "video".
    // For local selected files: check mimeType / type.
    const isVideo =
        image.mediaType === "video" ||
        image.mimeType?.startsWith("video/") ||
        image.type?.startsWith("video/");

    const previewSrc = image.imageUrl || image.preview || null;

    return (
        <div className="uploaded-image-card">

            <div className="uploaded-image-preview">

                {previewSrc ? (
                    isVideo ? (
                        <video
                            src={previewSrc}
                            muted
                            playsInline
                            preload="metadata"
                            className="uploaded-image-media"
                        />
                    ) : (
                        <img
                            src={previewSrc}
                            alt={displayName}
                            className="uploaded-image-media"
                        />
                    )
                ) : (
                    <div className="uploaded-image-placeholder">
                        <FontAwesomeIcon
                            icon={isVideo ? faVideo : faImage}
                        />
                    </div>
                )}

                {isVideo && (
                    <span className="uploaded-image-type-badge">
                        <FontAwesomeIcon icon={faVideo} />
                    </span>
                )}

            </div>

            <div className="uploaded-image-info">

                <h4 className="uploaded-image-name">
                    {displayName}
                </h4>

                <p className="uploaded-image-meta">
                    {sizeLabel}
                </p>

            </div>

            {onDelete && (
                <button
                    type="button"
                    className="uploaded-image-delete"
                    onClick={() =>
                        onDelete(image._id || image)
                    }
                    disabled={deleting}
                >
                    <FontAwesomeIcon
                        icon={deleting ? faSpinner : faTrash}
                        spin={deleting}
                    />
                </button>
            )}

        </div>
    );
};

export default UploadedImageCard;