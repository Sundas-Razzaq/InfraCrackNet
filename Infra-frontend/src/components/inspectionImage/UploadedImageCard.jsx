import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faImage,
} from "@fortawesome/free-solid-svg-icons";

const UploadedImageCard = ({
    image,
    onDelete,
}) => {
    return (
        <div className="uploaded-image-card">

            <div className="uploaded-image-preview">

                {image.imageUrl ? (
                    <img
                        src={image.imageUrl}
                        alt={image.originalFileName}
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
                    {image.originalFileName}
                </h4>

                <p className="uploaded-image-meta">
                    {(
                        image.fileSize /
                        (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                </p>

            </div>

            <button
                type="button"
                className="uploaded-image-delete"
                onClick={() =>
                    onDelete(image._id)
                }
            >
                <FontAwesomeIcon
                    icon={faTrash}
                />
            </button>

        </div>
    );
};

export default UploadedImageCard;