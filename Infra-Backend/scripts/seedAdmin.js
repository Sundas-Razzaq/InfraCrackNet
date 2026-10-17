require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/user");
const { hashPassword } = require("../src/services/authService");
const resetPassword = process.argv.includes("--reset-password");

const fail = (message) => {
    console.error(`ERROR: ${message}`);
    process.exitCode = 1;
};

const main = async () => {
    const name = String(process.env.ADMIN_NAME || "").trim();
    const email = String(process.env.ADMIN_EMAIL || "")
        .trim()
        .toLowerCase();
    const password = String(process.env.ADMIN_PASSWORD || "");

    if (!process.env.MONGO_URI) {
        return fail("MONGO_URI is not set in .env");
    }

    if (!name || !email || !password) {
        return fail(
            "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
        );
    }

    if (password.length < 8 || !/\d/.test(password)) {
        return fail(
            "ADMIN_PASSWORD must be at least 8 characters and contain a number"
        );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const admins = await User.find({ role: "Admin" }).select("email");

    if (admins.length > 1) {
        return fail(
            "More than one Admin exists. Remove the extra Admin documents manually, then run again."
        );
    }

    // Build indexes (including the single-Admin index) before writing.
    await User.init();

    /* An Admin already exists */
    if (admins.length === 1) {
        const admin = admins[0];

        if (!resetPassword) {
            console.log(
                `Admin already exists (${admin.email}). Nothing changed. Use --reset-password to reset its password.`
            );
            return;
        }

        if (admin.email !== email) {
            return fail(
                `ADMIN_EMAIL (${email}) does not match the existing Admin (${admin.email}).`
            );
        }

        await User.updateOne(
            { _id: admin._id },
            {
                $set: {
                    password: await hashPassword(password),
                    isActive: true,
                    isVerified: true,
                },
                $unset: {
                    resetPasswordToken: "",
                    resetPasswordExpire: "",
                },
            }
        );

        console.log(`Password reset and account re-activated for ${email}.`);
        return;
    }

    /* No Admin yet: create one */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return fail(
            `A ${existingUser.role} account already uses ${email}. Use a different ADMIN_EMAIL (no silent role promotion).`
        );
    }

    await User.create({
        name,
        email,
        password: await hashPassword(password),
        role: "Admin",
        isVerified: true,
        isActive: true,
    });

    console.log(`Admin created: ${email}`);
};

main()
    .catch((error) => {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });