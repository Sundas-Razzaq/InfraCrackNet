import AuthNavbar from "../components/auth/authNavbar";
import AuthContainer from "../components/auth/authContainer";
import AuthFooter from "../components/auth/authFooter";

function AuthLayout({ children, mode = "login", title, subtitle, footer }) {
    return (
        <div className="auth-layout">
            <AuthNavbar mode={mode} />
            <main className="auth-layout-main">
                <AuthContainer title={title} subtitle={subtitle} footer={footer}>
                    {children}
                </AuthContainer>
            </main>
            <AuthFooter />
        </div>
    );
}

export default AuthLayout;
