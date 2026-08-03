import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faImage,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const UploadedImageCard = ({
    image,
    onDelete,
    deleting = false,
}) => {
    const imageName =
        image.originalFileName || image.name;

    const imageSize = image.fileSize
        ? `${(
            image.fileSize /
            (1024 * 1024)
        ).toFixed(2)} MB`
        : "Ready to upload";

    return (
        <div className="uploaded-image-card">

            <div className="uploaded-image-preview">

                {image.imageUrl || image.preview ? (
                    <img
                        src={
                            image.imageUrl ||
                            image.preview
                        }
                        alt={imageName}
                    />
                ) : (
                    <div className="uploaded-image-placeholder">
                        <FontAwesomeIcon
                            icon={faImage}
                        />
                    </div>
                )}

            </div>

            <div className="uploaded-image-info">

                <h4 className="uploaded-image-name">
                    {imageName}
                </h4>

                <p className="uploaded-image-meta">
                    {imageSize}
                </p>

            </div>

            <button
                type="button"
                className="uploaded-image-delete"
                onClick={() => onDelete(image._id)}
                disabled={deleting}
            >
                <FontAwesomeIcon
                    icon={
                        deleting
                            ? faSpinner
                            : faTrash
                    }
                    spin={deleting}
                />
            </button>

        </div>
    );
};

export default UploadedImageCard;