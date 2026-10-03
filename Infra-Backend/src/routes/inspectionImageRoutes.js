const express = require("express");
const router = express.Router();

const {
    uploadInspectionImages,
    getInspectionImages,
    deleteInspectionImage,
    requestAnalysis,
    getUploadedImageCount,
} = require("../controllers/inspectionImageControllers");

const {
    uploadInspectionImagesValidation,
    requestAnalysisValidation,
} = require("../validations/inspectionImageValidators");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

/* Upload inspection images / videos */
router.post(
    "/upload",
    protect,
    authorizeRoles("Inspector"),
    upload.array("images", 20),
    uploadInspectionImagesValidation,
    uploadInspectionImages
);

/* Uploaded image count — MUST come before /:inspectionId */
router.get(
    "/stats/count",
    protect,
    getUploadedImageCount
);

/* Request analysis — Inspector hands off to Engineer */
router.post(
    "/:inspectionId/request-analysis",
    protect,
    authorizeRoles("Inspector"),
    requestAnalysisValidation,
    requestAnalysis
);

/* Get inspection images */
router.get(
    "/:inspectionId",
    protect,
    getInspectionImages
);

/* Delete inspection image */
router.delete(
    "/:imageId",
    protect,
    authorizeRoles("Inspector"),
    deleteInspectionImage
);

module.exports = router;