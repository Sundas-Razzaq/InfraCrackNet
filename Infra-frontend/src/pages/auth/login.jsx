import { useState } from "react";
import { getApiErrorMessage } from "../../api/authApi";
import { useAuth } from "../../context/useAuth";

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
            await loginUser({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
            onNavigate("/dashboard");
        } catch (err) {
            setError(getApiErrorMessage(err, "Login failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: 420, margin: "4rem auto", padding: "1.5rem" }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="password">Password</label>
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

                {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => onNavigate("/signup")}>
                    Sign up
                </button>
            </p>

            <p style={{ marginTop: "0.5rem" }}>
                <button type="button" onClick={() => onNavigate("/forgot-password")}>
                    Forgot password?
                </button>
            </p>
        </section>
    );
}

export default LoginPage;
