import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const requirements = [
    "Supported images: JPG, JPEG, PNG, HEIC, TIFF",
    "Supported videos: MP4, MOV, WEBM",
    "Maximum file size: 50 MB per file",
    "Upload up to 20 files in a single inspection",
    "Capture clear, high-resolution media of cracks",
    "Avoid blurry, dark, or obstructed photos",
    "Include different angles for better AI detection",
    "Videos: keep clips under 30 seconds",
];

const UploadRequirements = () => {
    return (
        <div className="upload-requirements-card">
            <h3 className="upload-requirements-title">
                Media Upload Guidelines
            </h3>

            <ul className="upload-requirements-list">
                {requirements.map((item) => (
                    <li key={item}>
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="requirement-icon"
                        />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UploadRequirements;