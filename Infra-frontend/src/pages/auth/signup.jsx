// src/pages/SignupPage.jsx
import { useState } from "react";
import AuthForm from "../../components/auth/authForm";
import { signup } from "../../api/authApi";
import AuthLayout from "../../layouts/authLayout";

function SignupPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Inspector",
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

    const handleRoleSelect = (role) => {
        setFormData((prev) => ({ ...prev, role }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Confirm password must match password.");
            setLoading(false);
            return;
        }

        try {
            const payload = { ...formData };
            delete payload.confirmPassword;
            await signup(payload);
            setSuccess("Signup successful. Redirecting to login...");

            setTimeout(() => {
                onNavigate("/login");
            }, 1200);
        } catch (err) {
            const apiMessage =
                err.response?.data?.message || "Signup failed. Please try again.";
            const apiErrors = err.response?.data?.errors;

            if (Array.isArray(apiErrors) && apiErrors.length > 0) {
                setError(apiErrors.map((item) => item.message || item).join(" "));
            } else {
                setError(apiMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            mode="signup"
            title="Create Your Account"
            subtitle="Join engineers using AI-powered structural inspection."
            footer={
                <p className="auth-page-action">
                    Already have an account?{" "}
                    <button type="button" onClick={() => onNavigate("/login")}>
                        Sign In →
                    </button>
                </p>
            }
        >
            <AuthForm
                type="signup"
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                message={error || success}
                messageTone={error ? "error" : "success"}
                submitLabel="Create Account"
                onRoleSelect={handleRoleSelect}
            />
        </AuthLayout>
    );
}

export default SignupPage;