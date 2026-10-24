const User = require("../models/user");
const { createNotification } = require("./notificationService");

/* Saare active Admins ko notification. Kabhi throw nahi karta. */
const notifyAdmins = async (payload) => {
    try {
        const admins = await User.find({
            role: "Admin",
            isActive: { $ne: false },
        })
            .select("_id")
            .lean();

        await Promise.all(
            admins.map((admin) =>
                createNotification({ ...payload, recipient: admin._id }).catch(
                    (error) =>
                        console.error("Admin notification failed:", error.message)
                )
            )
        );
    } catch (error) {
        console.error("notifyAdmins failed:", error.message);
    }
};

module.exports = { notifyAdmins };