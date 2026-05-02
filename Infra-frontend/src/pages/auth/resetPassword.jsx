import { useState } from "react";
import AuthForm from "../../components/auth/authForm";
import { getApiErrorMessage, resetPassword as resetPasswordApi } from "../../api/authApi";
import AuthLayout from "../../layouts/authLayout";

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
        <AuthLayout
            mode="reset"
            title="Reset Password"
            subtitle="Enter a new password for your account."
            footer={
                <p className="auth-page-action">
                    <button type="button" onClick={() => onNavigate("/login")}>
                        Back to login
                    </button>
                </p>
            }
        >
            <AuthForm
                type="reset"
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                message={error || success}
                messageTone={error ? "error" : "success"}
                submitLabel="Reset password"
            />
        </AuthLayout>
    );
}

export default ResetPasswordPage;
