import SeverityBadge from "./SeverityBadge";
import { fmtPx } from "../../utils/crackGeometery";

/* Overall summary for the image currently shown (from the ML service). */
const ImageSummary = ({ image }) => {
    if (!image) return null;

    const r = image.result;
    const m = r?.severityMetrics;

    // Older analyses have no image-level result: show what we can derive.
    const crackCount = r?.crackCount ?? image.cracks.length;

    return (
        <div className="image-summary-card">
            <div className="image-summary-header">
                <h3>Image Summary</h3>
                {r?.severity ? (
                    <SeverityBadge severity={r.severity} />
                ) : (
                    <span className="image-summary-none">No severity</span>
                )}
            </div>

            <div className="image-summary-grid">
                <div>
                    <span>Presence</span>
                    <strong>
                        {r?.presence?.label ?? "—"}
                        {r?.presence?.pCracked != null &&
                            ` (${(r.presence.pCracked * 100).toFixed(1)}%)`}
                    </strong>
                </div>
                <div>
                    <span>Cracks found</span>
                    <strong>{crackCount}</strong>
                </div>
                <div>
                    <span>Severity confidence</span>
                    <strong>
                        {r?.severityConfidence != null
                            ? `${Number(r.severityConfidence).toFixed(1)}%`
                            : "—"}
                    </strong>
                </div>
                <div>
                    <span>Total crack area</span>
                    <strong>
                        {m?.totalAreaPx != null ? `${m.totalAreaPx} px²` : "—"}
                        {m?.totalAreaRatio != null &&
                            ` (${(m.totalAreaRatio * 100).toFixed(2)}%)`}
                    </strong>
                </div>
                <div>
                    <span>Longest crack</span>
                    <strong>{fmtPx(m?.maxLengthPx)}</strong>
                </div>
                <div>
                    <span>Widest crack</span>
                    <strong>{fmtPx(m?.maxWidthPx)}</strong>
                </div>
                <div>
                    <span>Image size</span>
                    <strong>
                        {r?.imageWidth && r?.imageHeight
                            ? `${r.imageWidth} × ${r.imageHeight} px`
                            : "—"}
                    </strong>
                </div>
                <div>
                    <span>Processing time</span>
                    <strong>{r?.timingMs != null ? `${r.timingMs} ms` : "—"}</strong>
                </div>
            </div>

            {r?.notes?.length > 0 && (
                <ul className="image-summary-notes">
                    {r.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ImageSummary;
