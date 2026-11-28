// src/services/mlClient.js
const axios = require("axios");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Local dev default. Use 127.0.0.1 (not "localhost"): Node 18+ may resolve
// "localhost" to ::1 (IPv6) while uvicorn listens on IPv4 only.
const DEFAULT_LOCAL_URL = "http://127.0.0.1:8000";

const baseUrl = () =>
    (
        process.env.ML_SERVICE_URL ||
        (process.env.NODE_ENV === "production" ? "" : DEFAULT_LOCAL_URL)
    )
        .trim()
        .replace(/\/+$/, "");

const retryDelayMs = () => {
    const n = Number(process.env.ML_RETRY_DELAY_MS);
    return Number.isFinite(n) && n >= 0 ? n : 5000;
};

/* ------------------------------------------------------------------ */
/* Normalisation: guarantee a stable shape, never drop a field.        */
/* ------------------------------------------------------------------ */

const ALLOWED_CLASSES = [
    "Longitudinal",
    "Transverse",
    "Diagonal",
    "Alligator",
    "Pothole",
    "Surface",
    "Other",
];
const ALLOWED_SEVERITIES = ["Low", "Medium", "High", "Critical"];

const num = (v, fallback = null) => {
    const n = Number(v);
    return v !== null && v !== undefined && v !== "" && Number.isFinite(n) ? n : fallback;
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const normSeverity = (s, fallback = "Low") => {
    if (typeof s !== "string") return fallback;
    const t = s.trim();
    const hit = ALLOWED_SEVERITIES.find((x) => x.toLowerCase() === t.toLowerCase());
    return hit || fallback;
};

const normClass = (c) => {
    if (typeof c !== "string") return "Other";
    const t = c.replace(/\s*crack\s*$/i, "").trim();
    return ALLOWED_CLASSES.find((x) => x.toLowerCase() === t.toLowerCase()) || "Other";
};

// polygons: [[[x,y],...], ...] -> numbers only, >= 3 points per ring
const normPolygons = (polys) => {
    if (!Array.isArray(polys)) return [];
    return polys
        .map((ring) =>
            Array.isArray(ring)
                ? ring
                    .map((p) => (Array.isArray(p) ? [num(p[0]), num(p[1])] : null))
                    .filter((p) => p && p[0] !== null && p[1] !== null)
                : []
        )
        .filter((ring) => ring.length >= 3);
};

const normDetection = (d, index, imageSeverity) => {
    const box = d.box || {};
    return {
        crack_id: num(d.crack_id, index + 1),
        crack_class: normClass(d.crack_class),
        confidence: clamp(num(d.confidence, 0), 0, 100),
        severity: normSeverity(d.severity, imageSeverity || "Low"),
        length_px: num(d.length_px),
        max_width_px: num(d.max_width_px),
        mean_width_px: num(d.mean_width_px),
        area_px: num(d.area_px),
        area_ratio: num(d.area_ratio),
        length_ratio: num(d.length_ratio),
        max_width_ratio: num(d.max_width_ratio),
        box: {
            x: num(box.x, 0),
            y: num(box.y, 0),
            width: num(box.width, 0),
            height: num(box.height, 0),
        },
        polygons: normPolygons(d.polygons),
    };
};

/*
 * Maps the raw /analyze payload to a clean, fully-populated object.
 * Unknown top-level keys are kept under `extra` so nothing is lost.
 */
const normalizeAnalyzeResponse = (raw = {}) => {
    const size = Array.isArray(raw.image_size) ? raw.image_size : [];
    const imageSeverity = raw.severity ? normSeverity(raw.severity, null) : null;
    const detections = (Array.isArray(raw.detections) ? raw.detections : []).map((d, i) =>
        normDetection(d || {}, i, imageSeverity)
    );
    const m = raw.severity_metrics || null;

    const known = new Set([
        "image_size", "presence", "crack_count", "severity", "severity_confidence",
        "severity_metrics", "detections", "models_run", "notes", "timing_ms",
    ]);
    const extra = {};
    Object.keys(raw).forEach((k) => {
        if (!known.has(k)) extra[k] = raw[k];
    });

    return {
        image_size: [num(size[0]), num(size[1])],
        presence: {
            label: raw.presence?.label ?? null,
            confidence: num(raw.presence?.confidence),
            p_cracked: num(raw.presence?.p_cracked),
        },
        crack_count: num(raw.crack_count, detections.length),
        severity: imageSeverity,
        severity_confidence: num(raw.severity_confidence),
        severity_metrics: m
            ? {
                total_area_px: num(m.total_area_px),
                total_area_ratio: num(m.total_area_ratio),
                max_length_px: num(m.max_length_px),
                max_width_px: num(m.max_width_px),
            }
            : null,
        detections,
        models_run: Array.isArray(raw.models_run) ? raw.models_run : [],
        notes: Array.isArray(raw.notes) ? raw.notes.map(String) : [],
        timing_ms: num(raw.timing_ms),
        extra,
    };
};

/*
 * Sends an image to the ML service.
 * Free hosting may be asleep and slow on first request, so timeouts / 5xx
 * are retried (2 retries). Connection refused is reported clearly.
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
            return normalizeAnalyzeResponse(data);
        } catch (err) {
            lastError = err;
            const status = err.response?.status;
            const retryable = !status || status >= 500; // no retry on 4xx (bad key / image)
            if (!retryable || attempt === 3) break;
            await sleep(retryDelayMs() * attempt);
        }
    }

    if (lastError.code === "ECONNREFUSED") {
        throw new Error(
            `ML service unreachable at ${baseUrl()} (is Infra-AI running? try: uvicorn app:app --port 8000).`
        );
    }
    const body = lastError.response?.data;
    const raw = body?.detail ?? body;
    let detail = lastError.message;
    if (typeof raw === "string" && raw.trim()) detail = raw;
    else if (raw && typeof raw === "object") detail = JSON.stringify(raw);
    const status = lastError.response?.status;
    if (status === 500) {
        // FastAPI hides the real cause in the uvicorn terminal.
        console.error("[mlClient] ML service returned 500. Check the Infra-AI (uvicorn) terminal for the traceback.");
    }
    throw new Error(`ML service error${status ? ` (${status})` : ""}: ${detail}`.slice(0, 480));
};

module.exports = { analyzeImage, normalizeAnalyzeResponse };