import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../../layouts/authLayout";
import PasswordInput from "../../components/common/PasswordInput";
import { Chip } from "../../components/dashboard/shared/DetailsKit";

import { getApiErrorMessage } from "../../api/authApi";
import {
    acceptInvitation,
    acceptInvitationExisting,
    getInvitationByToken,
    rejectInvitation,
} from "../../api/invitationApi";
import { useAuth } from "../../context/useAuth";
import { formatDate } from "../../utils/adminFormat";

function AcceptInvitationPage() {
    const { token = "" } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isAuthLoading, logoutUser } = useAuth();

    const [invitation, setInvitation] = useState(null);
    const [phase, setPhase] = useState("loading"); // loading | ready | invalid | done
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({ name: "", password: "", confirmPassword: "" });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await getInvitationByToken(token);
                if (cancelled) return;
                setInvitation(res.data);
                setPhase("ready");
            } catch (err) {
                if (cancelled) return;
                setMessage(getApiErrorMessage(err, "This invitation link is not valid."));
                setPhase("invalid");
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        setError("");

        const name = form.name.trim();

        if (name.length < 3) {
            setError("Name must be at least 3 characters long.");
            return;
        }
        if (form.password.length < 6 || !/\d/.test(form.password)) {
            setError("Password must be at least 6 characters and contain a number.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Confirm password must match password.");
            return;
        }

        setBusy(true);

        try {
            const res = await acceptInvitation(token, { name, password: form.password });
            setMessage(res.message || "Account created. You can now log in.");
            setPhase("done");
        } catch (err) {
            if (err?.response?.data?.code === "ACCOUNT_EXISTS") {
                setInvitation((prev) => ({ ...prev, accountExists: true }));
            }
            setError(getApiErrorMessage(err, "Could not create the account."));
        } finally {
            setBusy(false);
        }
    };

    const handleAcceptExisting = async () => {
        setError("");
        setBusy(true);

        try {
            const res = await acceptInvitationExisting(token);
            toast.success(res.message || "Invitation accepted.");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Could not accept the invitation."));
        } finally {
            setBusy(false);
        }
    };

    const handleDecline = async () => {
        setError("");
        setBusy(true);

        try {
            const res = await rejectInvitation(token);
            setMessage(res.message || "Invitation declined.");
            setPhase("done");
        } catch (err) {
            setError(getApiErrorMessage(err, "Could not decline the invitation."));
        } finally {
            setBusy(false);
        }
    };

    const goToLogin = () =>
        navigate("/login", { state: { from: `/accept-invitation/${token}` } });

    const renderReady = () => {
        const sameAccount =
            isAuthenticated && user?.email?.toLowerCase() === invitation.email.toLowerCase();

        return (
            <>
                <div className="adm-invite-summary">
                    <p>
                        <strong>{invitation.invitedBy || "An administrator"}</strong> invited you to
                        join InfraCrackNet as <Chip tone="info">{invitation.role}</Chip>
                    </p>
                    <p className="adm-subtext">Valid until {formatDate(invitation.expiresAt)}</p>
                </div>

                {!invitation.accountExists && (
                    <form className="auth-form" onSubmit={handleCreateAccount} noValidate>
                        <div className="auth-field">
                            <label htmlFor="invite-email">Email</label>
                            <input id="invite-email" value={invitation.email} disabled />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="invite-name">Full Name</label>
                            <input
                                id="invite-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>

                        <PasswordInput
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />

                        <PasswordInput
                            label="Confirm Password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />

                        {error && <p className="auth-message auth-message-error">{error}</p>}

                        <button className="auth-submit-button" type="submit" disabled={busy}>
                            {busy ? "Creating Account..." : "Accept & Create Account"}
                        </button>
                    </form>
                )}

                {invitation.accountExists && (
                    <div className="auth-form">
                        {isAuthLoading && <p className="auth-message">Checking your session...</p>}

                        {!isAuthLoading && sameAccount && (
                            <>
                                <p className="auth-message">
                                    You are signed in as <strong>{user.email}</strong>.
                                </p>
                                {error && <p className="auth-message auth-message-error">{error}</p>}
                                <button
                                    className="auth-submit-button"
                                    type="button"
                                    onClick={handleAcceptExisting}
                                    disabled={busy}
                                >
                                    {busy ? "Accepting..." : "Accept Invitation"}
                                </button>
                            </>
                        )}

                        {!isAuthLoading && isAuthenticated && !sameAccount && (
                            <>
                                <p className="auth-message auth-message-error">
                                    You are signed in as {user?.email}, but this invitation was sent to{" "}
                                    {invitation.email}.
                                </p>
                                <button className="auth-submit-button" type="button" onClick={logoutUser}>
                                    Log out and continue
                                </button>
                            </>
                        )}

                        {!isAuthLoading && !isAuthenticated && (
                            <>
                                <p className="auth-message">
                                    An account already exists for <strong>{invitation.email}</strong>. Log
                                    in to accept this invitation.
                                </p>
                                <button className="auth-submit-button" type="button" onClick={goToLogin}>
                                    Log in to accept
                                </button>
                            </>
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <AuthLayout
            mode="signup"
            title="You're Invited"
            footer={
                phase === "ready" ? (
                    <p className="auth-page-action">
                        <button type="button" onClick={handleDecline} disabled={busy}>
                            Decline invitation
                        </button>
                    </p>
                ) : null
            }
        >
            {phase === "loading" && <p className="auth-message">Checking invitation...</p>}

            {phase === "invalid" && (
                <div className="auth-form">
                    <p className="auth-message auth-message-error">{message}</p>
                    <button className="auth-submit-button" type="button" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            )}

            {phase === "done" && (
                <div className="auth-form">
                    <p className="auth-message auth-message-success">{message}</p>
                    <button className="auth-submit-button" type="button" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            )}

            {phase === "ready" && invitation && renderReady()}
        </AuthLayout>
    );
}

export default AcceptInvitationPage;