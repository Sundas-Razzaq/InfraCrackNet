import AuthContainer from "../components/auth/authContainer";
import "../styles/auth.css";

function AuthLayout({ children, title, subtitle, footer }) {
    return (
        <div className="auth-layout-simple">
            <main className="auth-layout-main-simple">
                <AuthContainer title={title} subtitle={subtitle} footer={footer}>
                    {children}
                </AuthContainer>
            </main>
        </div>
    );
}

export default AuthLayout;