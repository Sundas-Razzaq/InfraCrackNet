const express = require("express");
const router = express.Router();
const {
    uploadInspectionImages,
    getInspectionImages,
    deleteInspectionImage,
    getUploadedImageCount,
} = require("../controllers/inspectionImageControllers");

const {
    uploadInspectionImagesValidation,
} = require("../validations/inspectionImageValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

/* Upload inspection images */
router.post(
    "/upload",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    upload.array("images", 20),
    uploadInspectionImagesValidation,
    uploadInspectionImages
);

/* Get inspection images */
router.get(
    "/:inspectionId",
    protect,
    getInspectionImages
);
/* Get uploaded image count */
router.get(
    "/stats/count",
    protect,
    getUploadedImageCount
);

/* Delete inspection image */
router.delete(
    "/:imageId",
    protect,
    authorizeRoles("Inspector", "Engineer"),
    deleteInspectionImage
);

module.exports = router;