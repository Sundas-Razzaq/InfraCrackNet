// src/services/mlClient.js
const axios = require("axios");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const baseUrl = () => (process.env.ML_SERVICE_URL || "").replace(/\/$/, "");

/*
 * Image ko ML service se analyse karwata hai.
 * Free hosting par service so jati hai, pehli request dair se aati hai,
 * is liye timeout/5xx par 2 baar dobara koshish hoti hai.
 */
const analyzeImage = async (imageUrl) => {
    if (!baseUrl() || !process.env.ML_API_KEY) {
        throw new Error("ML service is not configured (ML_SERVICE_URL / ML_API_KEY).");
    }

    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const { data } = await axios.post(
                `${baseUrl()}/analyze`,
                { image_url: imageUrl },
                {
                    headers: { "x-api-key": process.env.ML_API_KEY },
                    timeout: 90000,
                }
            );
            return data;
        } catch (err) {
            lastError = err;
            const status = err.response?.status;
            const retryable = !status || status >= 500;   // 4xx (galat key / image) par retry nahi
            if (!retryable || attempt === 3) break;
            await sleep(5000 * attempt);
        }
    }
    const detail = lastError.response?.data?.detail || lastError.message;
    throw new Error(`ML service error: ${detail}`);
};

module.exports = { analyzeImage };
