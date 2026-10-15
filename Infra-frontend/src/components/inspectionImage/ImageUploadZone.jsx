import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudArrowUp,
    faFolderOpen,
    faCamera,
} from "@fortawesome/free-solid-svg-icons";

const isAllowedFile = (file) =>
    file.type.startsWith("image/") ||
    file.type.startsWith("video/");

const ImageUploadZone = ({
    onFilesSelected,
    onOpenCamera,
}) => {
    const browseInputRef = useRef(null);

    const handleFileSelection = (event) => {
        const files = Array.from(event.target.files || []).filter(
            isAllowedFile
        );

        if (files.length === 0) {
            event.target.value = "";
            return;
        }

        onFilesSelected(files);
        event.target.value = "";
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const files = Array.from(
            event.dataTransfer.files || []
        ).filter(isAllowedFile);

        if (files.length === 0) {
            return;
        }

        onFilesSelected(files);
    };

    return (
        <div className="image-upload-card">
            <div
                className="image-upload-zone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="image-upload-icon">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                </div>

                <h3 className="image-upload-title">
                    Drag &amp; Drop Inspection Media
                </h3>

                <p className="image-upload-description">
                    Drop images or videos here, or choose one of the
                    options below.
                </p>

                <p className="image-upload-supported">
                    JPG • PNG • HEIC • TIFF • MP4 • MOV • WEBM • Max 50 MB
                </p>

                <div className="image-upload-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            browseInputRef.current.click()
                        }
                    >
                        <FontAwesomeIcon icon={faFolderOpen} />
                        Browse Files
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onOpenCamera}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                        Open Camera
                    </button>
                </div>

                <input
                    ref={browseInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    hidden
                    onChange={handleFileSelection}
                />
            </div>
        </div>
    );
};

export default ImageUploadZone;