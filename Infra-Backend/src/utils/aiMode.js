/*
 * Abhi analysis mock (simulated) hai. Asli AI lagne par .env mein AI_MODE=real.
 * Admin panel isi se label dikhata hai taake simulated nateeje asli na lagein.
 */
const AI_MODE = process.env.AI_MODE === "real" ? "real" : "simulated";

const AI_DISCLAIMER =
    "AI results are simulated for demonstration. They are not a real structural assessment.";

module.exports = {
    AI_MODE,
    IS_SIMULATED_AI: AI_MODE === "simulated",
    AI_DISCLAIMER,
};