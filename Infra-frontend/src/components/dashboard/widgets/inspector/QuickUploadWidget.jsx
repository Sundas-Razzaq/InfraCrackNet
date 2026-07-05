import WidgetCard from "../../shared/widgetCard";

function QuickUploadWidget() {
    return (
        <WidgetCard title="Quick Upload">
            <div className="upload-area">

                <div className="upload-placeholder">

                    <p className="upload-text">
                        Drag &amp; drop inspection images here
                    </p>

                    <p className="upload-subtext">
                        JPG • PNG • HEIC • TIFF — up to 50MB per image
                    </p>

                </div>

                <div className="upload-actions">

                    <button
                        type="button"
                        className="upload-btn"
                    >
                        Upload Images
                    </button>

                    <button
                        type="button"
                        className="capture-btn"
                    >
                        Capture Photo
                    </button>

                </div>

            </div>
        </WidgetCard>
    );
}

export default QuickUploadWidget;