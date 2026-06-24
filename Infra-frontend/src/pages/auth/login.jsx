// src/pages/LoginPage.jsx
import { useState } from "react";
import { getApiErrorMessage } from "../../api/authApi";
import AuthForm from "../../components/auth/authForm";
import { useAuth } from "../../context/useAuth";
import AuthLayout from "../../layouts/authLayout";

function LoginPage({ onNavigate }) {
    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateInput = () => {
        const email = formData.email.trim();
        const password = formData.password;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            return "Email and password are required.";
        }

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const validationError = validateInput();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            const role = response.user?.role;

            switch (role) {
                case "Admin":
                    onNavigate("/admin/dashboard");
                    break;
                case "Engineer":
                    onNavigate("/engineer/dashboard");
                    break;
                case "Inspector":
                default:
                    onNavigate("/inspector/dashboard");
                    break;
            }
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Login failed. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            mode="login"
            title="Welcome Back"
            subtitle="Your infrastructure insights are waiting for you."
            footer={
                <div className="auth-card-footer-links">
                    <p className="auth-page-action">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => onNavigate("/signup")}>
                            Create Account →
                        </button>
                    </p>
                    <p className="auth-page-action">
                        <button type="button" onClick={() => onNavigate("/forgot-password")}>
                            Forgot password?
                        </button>
                    </p>
                </div>
            }
        >
            <AuthForm
                type="login"
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                message={error}
                messageTone={error ? "error" : ""}
                submitLabel="Sign In"
            />
        </AuthLayout>
    );
}

export default LoginPage;