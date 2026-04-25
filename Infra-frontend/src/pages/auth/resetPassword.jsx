import { useState } from "react";
import { getApiErrorMessage, resetPassword as resetPasswordApi } from "../../api/authApi";

function ResetPasswordPage({ onNavigate, token }) {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateInput = () => {
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!token) {
            return "Reset token is missing or invalid.";
        }

        if (!password || !confirmPassword) {
            return "Password and confirm password are required.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (password !== confirmPassword) {
            return "Confirm password must match password.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await resetPasswordApi(token, {
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            setSuccess("Password reset successful. Redirecting to login...");
            setTimeout(() => {
                onNavigate("/login");
            }, 1200);
        } catch (err) {
            setError(getApiErrorMessage(err, "Reset failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: 420, margin: "4rem auto", padding: "1.5rem" }}>
            <h1>Reset Password</h1>
            <p style={{ marginBottom: "1rem" }}>
                Enter a new password for your account.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="password">New Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={{ width: "100%" }}
                    />
                </div>

                {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}
                {success ? <p style={{ color: "#2e7d32" }}>{success}</p> : null}

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                <button type="button" onClick={() => onNavigate("/login")}>
                    Back to login
                </button>
            </p>
        </section>
    );
}

export default ResetPasswordPage;
