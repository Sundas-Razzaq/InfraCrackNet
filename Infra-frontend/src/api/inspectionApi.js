import authApi from "./authApi";

// Create Inspection
export const createInspection = async (inspectionData) => {
    const { data } = await authApi.post(
        "/inspections",
        inspectionData
    );

    return data;
};

// Get All Inspections 
export const getInspections = async () => {
    const { data } = await authApi.get("/inspections");

    return data;
};

// Get Single Inspection 
export const getInspectionById = async (inspectionId) => {
    const { data } = await authApi.get(
        `/inspections/${inspectionId}`
    );

    return data;
};

// Update Inspection 
export const updateInspection = async (
    inspectionId,
    inspectionData
) => {
    const { data } = await authApi.put(
        `/inspections/${inspectionId}`,
        inspectionData
    );

    return data;
};

// Delete Inspection 
export const deleteInspection = async (inspectionId) => {
    const { data } = await authApi.delete(
        `/inspections/${inspectionId}`
    );

    return data;
};