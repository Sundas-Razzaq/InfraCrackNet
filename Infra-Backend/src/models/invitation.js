const mongoose = require("mongoose");

const stripTokenHash = (doc, ret) => {
    delete ret.tokenHash;
    return ret;
};

const invitationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ["Inspector", "Engineer"],
            required: true,
        },

        // SHA-256 hash of the emailed token. The raw token is never stored.
        tokenHash: {
            type: String,
            required: true,
            unique: true,
            select: false,
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Expired"],
            default: "Pending",
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        respondedAt: {
            type: Date,
            default: null,
        },

        lastSentAt: {
            type: Date,
        },

        resendCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { transform: stripTokenHash },
        toObject: { transform: stripTokenHash },
    }
);

// Only ONE Pending invitation per email (other statuses are not restricted).
invitationSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { status: "Pending" } }
);

invitationSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("Invitation", invitationSchema);