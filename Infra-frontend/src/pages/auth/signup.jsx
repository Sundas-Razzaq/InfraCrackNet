import { useState } from "react";
import { signup } from "../../api/authApi";

function SignupPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
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

        try {
            await signup(formData);
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
        <section style={{ maxWidth: 420, margin: "4rem auto", padding: "1.5rem" }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={3}
                        style={{ width: "100%" }}
                    />
                </div>

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
                {success ? <p style={{ color: "#2e7d32" }}>{success}</p> : null}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                Already have an account?{" "}
                <button type="button" onClick={() => onNavigate("/login")}>
                    Login
                </button>
            </p>
        </section>
    );
}

export default SignupPage;
