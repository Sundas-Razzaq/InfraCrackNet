import AuthContainer from "../components/auth/authContainer";
import AuthSidebar from "../components/auth/AuthSidebar";
import "../styles/auth.css";

function AuthLayout({ children, title, subtitle, footer, mode = "login" }) {
    return (
        <div className="auth-layout-split">
            <AuthSidebar mode={mode} />
            <main className="auth-layout-main-split">
                <AuthContainer title={title} subtitle={subtitle} footer={footer}>
                    {children}
                </AuthContainer>
            </main>
        </div>
    );
}

export default AuthLayout;