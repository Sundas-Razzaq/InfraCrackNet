import authApi from "./authApi";

// Upload Inspection Images

export const uploadInspectionImages = async (
    inspectionId,
    files
) => {
    const formData = new FormData();

    formData.append("inspection", inspectionId);

    files.forEach((file) => {

        let type = file.type;

        if (!type) {
            const ext = (file.name || "")
                .split(".")
                .pop()
                ?.toLowerCase();

            const map = {
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                heic: "image/heic",
                heif: "image/heif",
                tiff: "image/tiff",
                tif: "image/tiff",
                avif: "image/avif",
                webp: "image/webp",
                bmp: "image/bmp",
                gif: "image/gif",
                mp4: "video/mp4",
                mov: "video/quicktime",
                webm: "video/webm",
                avi: "video/x-msvideo",
                mkv: "video/x-matroska",
                m4v: "video/x-m4v",
            };

            type = map[ext] || "application/octet-stream";
        }

        const typedFile = new File([file], file.name, {
            type,
            lastModified: file.lastModified || Date.now(),
        });

        formData.append("images", typedFile, file.name);
    });

    const { data } = await authApi.post(
        "/inspection-images/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

// Get Inspection Images

export const getInspectionImages = async (
    inspectionId
) => {
    const { data } = await authApi.get(
        `/inspection-images/${inspectionId}`
    );

    return data;
};

// Delete Inspection Image

export const deleteInspectionImage = async (
    imageId
) => {
    const { data } = await authApi.delete(
        `/inspection-images/${imageId}`
    );

    return data;
};

// Get total uploaded image count
export const getUploadedImageCount = async () => {
    const { data } = await authApi.get(
        "/inspection-images/stats/count"
    );

    return data;
};

//request analysis for an inspection
export const requestAnalysis = async (inspectionId) => {
    const { data } = await authApi.post(
        `/inspection-images/${inspectionId}/request-analysis`
    );

    return data;
};