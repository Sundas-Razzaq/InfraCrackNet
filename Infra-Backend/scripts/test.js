require("dotenv").config();

const mongoose = require("mongoose");
const { logActivity } = require("../src/services/activityLogService");
const { ACTIVITY_ACTIONS } = require("../src/utils/activityActions");

(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await logActivity({
        actor: {
            id: new mongoose.Types.ObjectId().toString(),
            role: "Inspector",
        },
        action: ACTIVITY_ACTIONS.INSPECTION_CREATED,
        targetType: "Inspection",
        targetLabel: "TEST-001",
    });

    console.log(
        result ? `Created: ${result._id}` : "FAILED (see error above)"
    );

    await mongoose.disconnect();
})();