import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faTriangleExclamation,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const UploadProgressItem = ({
    fileName,
    progress = 0,
    status = "uploading",
}) => {
    const renderStatusIcon = () => {
        switch (status) {
            case "completed":
                return (
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="upload-status-success"
                    />
                );

            case "failed":
                return (
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="upload-status-error"
                    />
                );

            default:
                return (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="upload-status-loading"
                    />
                );
        }
    };

    return (
        <div className="upload-progress-item">

            <div className="upload-progress-header">

                <div className="upload-progress-info">

                    <span className="upload-progress-name">
                        {fileName}
                    </span>

                    <span className="upload-progress-percentage">
                        {progress}%
                    </span>

                </div>

                {renderStatusIcon()}

            </div>

            <div className="upload-progress-bar">

                <div
                    className="upload-progress-fill"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

        </div>
    );
};

export default UploadProgressItem;