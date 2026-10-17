require("dotenv").config();

const mongoose = require("mongoose");
const ActivityLog = require("../src/models/activityLog");

const expectBlocked = async (label, fn) => {
    try {
        await fn();
        console.log(`FAIL: ${label} was allowed`);
    } catch (error) {
        console.log(`OK: ${label} blocked -> ${error.message}`);
    }
};

(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await expectBlocked("deleteMany", () => ActivityLog.deleteMany({}));
    await expectBlocked("updateOne", () =>
        ActivityLog.updateOne({}, { $set: { message: "tampered" } })
    );

    const doc = await ActivityLog.findOne();
    if (doc) {
        await expectBlocked("save() on existing entry", async () => {
            doc.message = "tampered";
            await doc.save();
        });
    } else {
        console.log("No entries yet: create some, then run again for the save() check.");
    }

    await mongoose.disconnect();
})();