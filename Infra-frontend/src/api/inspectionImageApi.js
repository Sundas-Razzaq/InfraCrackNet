import authApi from "./authApi";

// Upload Inspection Images

export const uploadInspectionImages = async (
    inspectionId,
    files
) => {
    const formData = new FormData();

    formData.append(
        "inspection",
        inspectionId
    );

    files.forEach((file) => {
        formData.append("images", file);
    });

    const { data } = await authApi.post(
        "/inspection-images/upload",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
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