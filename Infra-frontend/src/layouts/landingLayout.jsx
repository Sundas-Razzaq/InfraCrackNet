import Navbar from "../components/landing/navbar.jsx";
import Footer from "../components/landing/footer.jsx";

function LandingLayout({ children }) {
    return (
        <div className="landing-layout">
            <Navbar />
            <main className="landing-layout-main">{children}</main>
            <Footer />
        </div>
    );
}

export default LandingLayout;
