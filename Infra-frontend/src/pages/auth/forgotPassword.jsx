import { useState } from "react";
import { forgotPassword as forgotPasswordApi, getApiErrorMessage } from "../../api/authApi";

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
        <section style={{ maxWidth: 420, margin: "4rem auto", padding: "1.5rem" }}>
            <h1>Forgot Password</h1>
            <p style={{ marginBottom: "1rem" }}>
                Enter your email address and we&apos;ll send a reset link if the account exists.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}
                {success ? <p style={{ color: "#2e7d32" }}>{success}</p> : null}

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                </button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                Remembered your password?{" "}
                <button type="button" onClick={() => onNavigate("/login")}>
                    Back to login
                </button>
            </p>
        </section>
    );
}

export default ForgotPasswordPage;
