const User = require("../models/user");

const {
    comparePassword,
    hashPassword,
} = require("../services/authService");

const {
    uploadImage,
    deleteImage,
} = require("../services/cloudinaryService");

/*Get logged-in user's profile*/
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/*Update logged-in user's profile*/
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            organization,
            position,
            bio,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Prevent duplicate emails
        if (normalizedEmail !== user.email.toLowerCase()) {
            const existingUser = await User.findOne({
                email: normalizedEmail,
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already in use",
                });
            }

            user.email = normalizedEmail;
        }

        user.name = name;
        user.phone = phone;
        user.organization = organization;
        user.position = position;
        user.bio = bio;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* Change password */
const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordCorrect =
            await comparePassword(
                currentPassword,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        const isSamePassword =
            await comparePassword(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            return res.status(400).json({
                message:
                    "New password cannot be the same as the current password.",
            });
        }

        user.password =
            await hashPassword(newPassword);

        await user.save();

        return res.status(200).json({
            message:
                "Password updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* Upload profile photo */
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image.",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Remove previous image from Cloudinary
        if (user.profileImage?.publicId) {
            await deleteImage(user.profileImage.publicId);
        }

        // Upload new image
        const uploadedImage = await uploadImage(
            req.file.buffer,
            "InfraCrackNet/ProfilePictures"
        );

        user.profileImage = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };

        await user.save();

        const updatedUser = await User.findById(user._id)
            .select("-password");

        return res.status(200).json({
            message: "Profile photo updated successfully.",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
};