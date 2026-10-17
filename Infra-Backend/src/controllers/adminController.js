const User = require("../models/user");

/* Returns the logged-in Admin's own profile (used to verify admin access). */
const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await User.findById(req.user.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminProfile,
};