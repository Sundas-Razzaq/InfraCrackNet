function CTASection({
	title = "Start analyzing infrastructure with AI today",
	description =
		"Join hundreds of engineering firms reducing inspection costs by 60% with InfraCrackNet AI.",
	ctaLabel = "Get Started Now",
	ctaHref = "/signup",
}) {
	return (
		<section className="landing-cta-section" aria-labelledby="landing-cta-title">
			<div className="landing-cta-container">
				<div className="landing-cta-card">
					<h2 id="landing-cta-title" className="landing-cta-title">
						{title}
					</h2>

					<p className="landing-cta-description">{description}</p>

					<a className="landing-cta-button" href={ctaHref}>
						{ctaLabel}
					</a>
				</div>
			</div>
		</section>
	);
}

export default CTASection;
