import { useState } from "react";
import AuthForm from "../../components/auth/authForm";
import { forgotPassword as forgotPasswordApi, getApiErrorMessage } from "../../api/authApi";
import AuthLayout from "../../layouts/authLayout";

function ForgotPasswordPage({ onNavigate }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const trimmedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedEmail) {
            setError("Email is required.");
            return;
        }

        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            await forgotPasswordApi({ email: trimmedEmail });
            setSuccess("If email exists, reset link sent");
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Unable to send reset link. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            mode="forgot"
            title="Forgot Password"
            subtitle="Enter your email address and we&apos;ll send a reset link if the account exists."
            footer={
                <p className="auth-page-action">
                    Remembered your password?{" "}
                    <button type="button" onClick={() => onNavigate("/login")}>
                        Back to login
                    </button>
                </p>
            }
        >
            <AuthForm
                type="forgot"
                values={{ email }}
                onChange={(event) => setEmail(event.target.value)}
                onSubmit={handleSubmit}
                loading={loading}
                message={error || success}
                messageTone={error ? "error" : "success"}
                submitLabel="Send reset link"
            />
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
