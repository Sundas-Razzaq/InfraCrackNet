import buildingsImage from "../../assets/images/landingPageImages/buidings.png";
import bridgesImage from "../../assets/images/landingPageImages/bridges.png";
import roadsImage from "../../assets/images/landingPageImages/roads.png";
import { motion } from "framer-motion";
import { container, fadeInUp, sectionViewport } from "../../utils/landingMotion";

const defaultUseCases = [
    {
        id: "buildings",
        title: "Buildings",
        description: "Structural health for commercial real estate and residential complexes.",
        image: buildingsImage,
        alt: "Modern building facade for infrastructure inspection use case",
    },
    {
        id: "bridges",
        title: "Bridges",
        description: "Critical infrastructure monitoring for spans, pillars, and trusses.",
        image: bridgesImage,
        alt: "Bridge cable structure for inspection use case",
    },
    {
        id: "roads",
        title: "Roads",
        description: "Automated pavement analysis and highway maintenance scheduling.",
        image: roadsImage,
        alt: "Road surface monitoring and maintenance use case",
    },
];

function UsecaseSection({
    title = "Vertical Specialization",
    description = "Our models are fine-tuned for the unique texture and lighting challenges of different infrastructure types.",
    useCases = defaultUseCases,
}) {
    return (
        <section className="landing-usecase-section" aria-labelledby="landing-usecase-title" id="usecaseSection">
            <div className="landing-usecase-container">
                <motion.header
                    className="landing-usecase-header"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={sectionViewport}
                >
                    <h2 id="landing-usecase-title" className="landing-usecase-title">
                        {title}
                    </h2>
                    <p className="landing-usecase-description">{description}</p>
                </motion.header>

                <motion.div
                    className="landing-usecase-grid"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={sectionViewport}
                >
                    {useCases.map((useCase) => (
                        <motion.article
                            className="landing-usecase-card"
                            key={useCase.id}
                            variants={fadeInUp}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <div className="landing-usecase-image-wrap">
                                <img src={useCase.image} alt={useCase.alt} className="landing-usecase-image" />
                            </div>
                            <div className="landing-usecase-content">
                                <h3 className="landing-usecase-card-title">{useCase.title}</h3>
                                <p className="landing-usecase-card-text">{useCase.description}</p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default UsecaseSection;
