const AnalysisProgressCard = ({
    analysis,
}) => {
    const progress =
        analysis?.progress ?? 0;

    return (
        <div className="analysis-status-card">

            <div className="analysis-status-description">

                <p>
                    The AI engine is analyzing the uploaded
                    inspection images.
                </p>

            </div>

            <div className="analysis-status-body">

                <div className="analysis-progress-row">

                    <span>
                        Progress
                    </span>

                    <strong>
                        {progress}%
                    </strong>

                </div>

                <div className="analysis-progress-bar">

                    <div
                        className="analysis-progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <div className="analysis-status-grid">

                    <div className="analysis-status-item">

                        <label>
                            Status
                        </label>

                        <p>
                            {analysis?.status}
                        </p>

                    </div>

                    <div className="analysis-status-item">

                        <label>
                            Current Step
                        </label>

                        <p>
                            {analysis?.currentStep}
                        </p>

                    </div>

                    <div className="analysis-status-item">

                        <label>
                            Images Processed
                        </label>

                        <p>
                            {analysis?.processedImages} /{" "}
                            {analysis?.totalImages}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AnalysisProgressCard;