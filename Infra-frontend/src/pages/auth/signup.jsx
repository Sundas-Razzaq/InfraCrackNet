import { useState } from "react";
import AuthForm from "../../components/auth/authForm";
import { signup } from "../../api/authApi";
import AuthLayout from "../../layouts/authLayout";

function SignupPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
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
            const { confirmPassword, ...payload } = formData;
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
            title="Create Account"
            subtitle="Enter your details to begin monitoring structural integrity."
            footer={
                <p className="auth-page-action">
                    Already have an account?{" "}
                    <button type="button" onClick={() => onNavigate("/login")}>
                        Login
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
            />
        </AuthLayout>
    );
}

export default SignupPage;
