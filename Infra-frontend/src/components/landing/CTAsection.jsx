import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CTASection({
	title = "Start analyzing infrastructure with AI today",
	description =
	"Join hundreds of engineering firms reducing inspection costs by 60% with InfraCrackNet AI.",
	ctaLabel = "Get Started Now",
	id = "cta",
}) {
	const navigate = useNavigate();

	const handleGetStarted = () => {
		navigate("/signup");
	};

	return (
		<section className="landing-cta-section" aria-labelledby="landing-cta-title" id={id}>
			<div className="landing-cta-container">
				<motion.div
					className="landing-cta-card"
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<h2 id="landing-cta-title" className="landing-cta-title">
						{title}
					</h2>

					<p className="landing-cta-description">{description}</p>

					<motion.button
						type="button"
						className="landing-cta-button"
						onClick={handleGetStarted}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						animate={{
							boxShadow: [
								"0 0 0 rgba(0,0,0,0)",
								"0 0 20px rgba(59,130,246,0.3)",
								"0 0 0 rgba(0,0,0,0)",
							],
						}}
						transition={{
							duration: 0.6,
							ease: "easeOut",
							boxShadow: {
								duration: 2,
								repeat: Infinity,
								ease: "easeOut",
							},
						}}
					>
						{ctaLabel}
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}

export default CTASection;
