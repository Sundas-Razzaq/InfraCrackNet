const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Team name is required."],
            trim: true,
            minlength: [2, "Team name must be at least 2 characters."],
            maxlength: [80, "Team name cannot exceed 80 characters."],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters."],
            default: "",
        },

        // A new team is a draft (Inactive) until it has an eligible lead.
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Inactive",
        },

        // Exactly one lead per team (a single field cannot hold two).
        engineerLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Team names are unique, ignoring upper/lower case ("Team A" = "team a").
teamSchema.index(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

teamSchema.index({ status: 1 });
teamSchema.index({ engineerLead: 1 });

module.exports = mongoose.model("Team", teamSchema);