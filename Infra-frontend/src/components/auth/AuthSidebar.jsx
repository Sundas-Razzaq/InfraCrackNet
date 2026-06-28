function AuthSidebar({ mode = "login" }) {
    const isLogin = mode === "login";
    const isSignup = mode === "signup";
    const isForgot = mode === "forgot";
    const isReset = mode === "reset";

    return (
        <div className="auth-sidebar">
            <div className="auth-sidebar-content">
                {isLogin && (
                    // Login Sidebar Content
                    <>
                        <h1 className="auth-sidebar-title">Welcome Back</h1>
                        <p className="auth-sidebar-subtitle">
                            Your infrastructure insights are waiting for you.
                        </p>
                        <ul className="auth-sidebar-features">
                            <li>Real-time AI crack detection</li>
                            <li>Automated severity classification</li>
                            <li>One-click PDF report generation</li>
                            <li>Multi-role team collaboration</li>
                        </ul>
                        <p className="auth-sidebar-trust">
                            Trusted by 200+ engineering firms worldwide
                        </p>
                    </>
                )}

                {isSignup && (
                    // Signup Sidebar Content
                    <>
                        <div className="auth-sidebar-brand">InfraCrackNet</div>
                        <h1 className="auth-sidebar-title">Create Your Account</h1>
                        <p className="auth-sidebar-subtitle">
                            Join engineers using AI-powered structural inspection.
                        </p>
                    </>
                )}

                {isForgot && (
                    // Forgot Password Sidebar Content
                    <>
                        <div className="auth-sidebar-brand">InfraCrackNet</div>
                        <h1 className="auth-sidebar-title">Reset Password</h1>
                        <p className="auth-sidebar-subtitle">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <ul className="auth-sidebar-features">
                            <li>Secure password reset</li>
                            <li>Quick account recovery</li>
                            <li>24/7 support available</li>
                        </ul>
                    </>
                )}

                {isReset && (
                    // Reset Password Sidebar Content
                    <>
                        <div className="auth-sidebar-brand">InfraCrackNet</div>
                        <h1 className="auth-sidebar-title">Set New Password</h1>
                        <p className="auth-sidebar-subtitle">
                            Create a new strong password for your account.
                        </p>
                        <ul className="auth-sidebar-features">
                            <li>Minimum 6 characters</li>
                            <li>Use a mix of letters and numbers</li>
                            <li>Keep it memorable but secure</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthSidebar;