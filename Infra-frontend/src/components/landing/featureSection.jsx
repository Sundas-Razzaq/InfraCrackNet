import roadsImage from "../../assets/images/landingPageImages/roads.png";

const defaultFeatureCards = [
	{
		id: "detection",
		icon: "target",
		title: "Automated Detection",
		description:
			"Instant identification of micro-cracks and structural fissures across any concrete or asphalt surface using proprietary neural networks.",
	},
	{
		id: "measurement",
		icon: "ruler",
		title: "Crack Measurement",
		description:
			"Sub-millimeter precision for width, length, and depth assessment without manual calipers.",
	},
	{
		id: "severity",
		icon: "alert",
		title: "Severity Classification",
		description:
			"Automated risk assessment based on structural standards and historical fatigue data.",
	},
];

function FeatureIcon({ type }) {
	if (type === "ruler") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" className="landing-feature-icon-svg">
				<rect x="3" y="7" width="18" height="10" rx="2" />
				<path d="M7 10v4M11 10v2M15 10v4M19 10v2" />
			</svg>
		);
	}

	if (type === "alert") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" className="landing-feature-icon-svg">
				<path d="M12 4 3.5 19h17L12 4Z" />
				<path d="M12 9v5M12 17h.01" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="landing-feature-icon-svg">
			<circle cx="12" cy="12" r="8" />
			<circle cx="12" cy="12" r="3" />
			<path d="M12 8v2M16 12h-2M12 16v-2M8 12h2" />
		</svg>
	);
}

function FeatureSection({
	title = "Precision Analysis Toolkit",
	subtitle = "Engineered for accuracy, built for scale. Our AI models are trained on millions of structural samples.",
	featureCards = defaultFeatureCards,
	reportTitle = "Report Generation",
	reportDescription = "One-click professional PDF audits including GIS coordinates, severity maps, and remediation advice.",
	reportCtaLabel = "Learn More",
	reportCtaHref = "#",
	imageSrc = roadsImage,
	imageAlt = "Aerial roadway infrastructure analysis",
}) {
	return (
		<section className="landing-feature-section" aria-labelledby="landing-feature-title">
			<div className="landing-feature-container">
				<header className="landing-feature-header">
					<h2 id="landing-feature-title" className="landing-feature-title">
						{title}
					</h2>
					<p className="landing-feature-subtitle">{subtitle}</p>
				</header>

				<div className="landing-feature-top-grid">
					{featureCards.map((feature, index) => (
						<article
							key={feature.id}
							className={`landing-feature-card ${index === 0 ? "landing-feature-card-wide" : ""}`}
						>
							<div className="landing-feature-icon" aria-hidden="true">
								<FeatureIcon type={feature.icon} />
							</div>
							<h3 className="landing-feature-card-title">{feature.title}</h3>
							<p className="landing-feature-card-text">{feature.description}</p>
						</article>
					))}
				</div>

				<div className="landing-feature-bottom-grid">
					<article className="landing-report-card">
						<div className="landing-feature-icon" aria-hidden="true">
							<FeatureIcon type="report" />
						</div>
						<h3 className="landing-report-title">{reportTitle}</h3>
						<p className="landing-report-text">{reportDescription}</p>
						<a className="landing-report-link" href={reportCtaHref}>
							{reportCtaLabel}
							<span aria-hidden="true">→</span>
						</a>
					</article>

					<figure className="landing-feature-image-wrap">
						<img src={imageSrc} alt={imageAlt} className="landing-feature-image" />
					</figure>
				</div>
			</div>
		</section>
	);
}

export default FeatureSection;
