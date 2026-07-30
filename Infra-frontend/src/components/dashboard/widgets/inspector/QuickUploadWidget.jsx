import WidgetCard from "../../shared/widgetCard";
import { motion } from "framer-motion";
import { scaleIn } from "../../../../utils/animation";

function QuickUploadWidget() {
    return (
        <WidgetCard title="Quick Upload">
            <motion.div
                className="upload-area"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >

                <p className="upload-text">
                    Drag &amp; drop inspection images here
                </p>

                <p className="upload-subtext">
                    JPG • PNG • HEIC • TIFF — up to 50MB per image
                </p>

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

            </motion.div>
        </WidgetCard>
    );
}

export default QuickUploadWidget;