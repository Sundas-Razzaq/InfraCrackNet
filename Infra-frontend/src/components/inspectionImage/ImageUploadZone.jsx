import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudArrowUp,
    faFolderOpen,
    faCamera,
} from "@fortawesome/free-solid-svg-icons";

const ImageUploadZone = ({ onFilesSelected }) => {
    const browseInputRef = useRef(null);
    const captureInputRef = useRef(null);
    const handleFileSelection = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) {
            return;
        }
        onFilesSelected(files);
        event.target.value = "";
    };

    return (
        <div className="image-upload-card">

            <div className="image-upload-zone">

                <div className="image-upload-icon">
                    <FontAwesomeIcon
                        icon={faCloudArrowUp}
                    />
                </div>

                <h3 className="image-upload-title">
                    Drag &amp; Drop Inspection Images
                </h3>

                <p className="image-upload-description">
                    Drop images here or choose one of the
                    options below.
                </p>

                <p className="image-upload-supported">
                    JPG • PNG • HEIC • TIFF •
                    Maximum 50 MB per image
                </p>

                <div className="image-upload-actions">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            browseInputRef.current.click()
                        }
                    >
                        <FontAwesomeIcon
                            icon={faFolderOpen}
                        />
                        Browse Files
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            captureInputRef.current.click()
                        }
                    >
                        <FontAwesomeIcon
                            icon={faCamera}
                        />
                        Capture Images
                    </button>

                </div>

                {/* Browse Files */}

                <input
                    ref={browseInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleFileSelection}
                />

                {/* Camera */}

                <input
                    ref={captureInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={handleFileSelection}
                />

            </div>

        </div>
    );
};

export default ImageUploadZone;