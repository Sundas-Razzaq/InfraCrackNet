const mongoose = require("mongoose");

const {
    ACTIVITY_ACTION_VALUES,
    ACTIVITY_TARGET_TYPES,
} = require("../utils/activityActions");

const activityLogSchema = new mongoose.Schema(
    {
        // null for system-generated events (e.g. invitation expiry)
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Snapshot: the actor's role at the time of the action
        actorRole: {
            type: String,
            enum: ["Admin", "Engineer", "Inspector", "System"],
            required: true,
        },

        action: {
            type: String,
            enum: ACTIVITY_ACTION_VALUES,
            required: true,
        },

        targetType: {
            type: String,
            enum: ACTIVITY_TARGET_TYPES,
            required: true,
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        // Snapshot: readable name (project code, team name, email...)
        // so the entry stays meaningful even if the target is deleted.
        targetLabel: {
            type: String,
            trim: true,
            maxlength: 200,
            default: "",
        },

        // Before/after values for administrative changes
        changes: {
            before: { type: mongoose.Schema.Types.Mixed },
            after: { type: mongoose.Schema.Types.Mixed },
        },

        outcome: {
            type: String,
            enum: ["success", "failure"],
            default: "success",
        },

        message: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        // Logs are never updated, so no updatedAt.
        timestamps: { createdAt: true, updatedAt: false },
    }
);

/* Indexes */
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });

/* Immutability: entries can be created, never changed or removed */

const immutableError = () =>
    new Error("Activity log entries are immutable.");

activityLogSchema.pre("save", async function () {
    if (!this.isNew) {
        throw immutableError();
    }
});

activityLogSchema.pre(
    [
        "updateOne",
        "updateMany",
        "findOneAndUpdate",
        "findOneAndReplace",
        "findOneAndDelete",
        "replaceOne",
        "deleteOne",
        "deleteMany",
    ],
    async function () {
        throw immutableError();
    }
);

// doc.deleteOne() on a document instance
activityLogSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function () {
        throw immutableError();
    }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);