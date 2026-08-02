import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const requirements = [
    "Supported formats: JPG, JPEG, PNG, HEIC, TIFF",
    "Maximum file size: 50 MB per image",
    "Upload up to 20 images in a single inspection",
    "Capture clear, high-resolution images of cracks",
    "Avoid blurry, dark, or obstructed photos",
    "Include different angles for better AI detection",
];

const UploadRequirements = () => {
    return (
        <div className="upload-requirements-card">

            <h3 className="upload-requirements-title">
                Image Upload Guidelines
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