export const saveBlob = (data, fileName, type = "application/pdf") => {
    const url = window.URL.createObjectURL(new Blob([data], { type }));
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};

// A failed blob download carries its JSON error body as a Blob.
export const getDownloadErrorMessage = async (error, fallback) => {
    try {
        const text = await error.response.data.text();
        return JSON.parse(text).message || fallback;
    } catch {
        return error?.message || fallback;
    }
};