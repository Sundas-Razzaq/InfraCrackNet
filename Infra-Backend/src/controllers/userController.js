const User = require("../models/user");

/* List users, optionally filtered by role.
   Only Engineers (and Admins) may call this.
   Returns id, name, email, role — no password or sensitive fields. */
const listUsers = async (req, res, next) => {
    try {
        const { role } = req.query;

        const query = {};

        if (role) {
            if (!["Engineer", "Inspector", "Admin"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role filter.",
                });
            }
            query.role = role;
        }

        const users = await User.find(query)
            .select("_id name email role")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listUsers,
};