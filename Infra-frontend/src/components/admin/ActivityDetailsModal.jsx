import { Link } from "react-router-dom";

import AdminModal from "./AdminModal";
import { Button, Card, Chip, Row } from "../dashboard/shared/DetailsKit";

import { activityTargetPath, actionLabel } from "../../utils/activityActions";
import { formatDateTime } from "../../utils/adminFormat";

const hasKeys = (value) =>
    Boolean(value) && typeof value === "object" && Object.keys(value).length > 0;

const Json = ({ value }) => <pre className="adm-json">{JSON.stringify(value, null, 2)}</pre>;

const ActivityDetailsModal = ({ entry, onClose }) => {
    const targetPath = activityTargetPath(entry);
    const failed = entry.outcome === "failure";

    const showChanges = hasKeys(entry.changes?.before) || hasKeys(entry.changes?.after);

    return (
        <AdminModal
            isOpen
            wide
            title={actionLabel(entry.action)}
            subtitle={formatDateTime(entry.createdAt)}
            onClose={onClose}
            footer={
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            }
        >
            <div className="dtl">
                <Card title="Event">
                    <dl className="dtl-rows">
                        <Row label="Actor">
                            {entry.actor ? `${entry.actor.name} (${entry.actorRole})` : entry.actorRole}
                        </Row>
                        <Row label="Action">{entry.action}</Row>
                        <Row label="Target">
                            {`${entry.targetType}${entry.targetLabel ? ` · ${entry.targetLabel}` : ""}`}
                        </Row>
                        <Row label="Outcome">
                            <Chip tone={failed ? "danger" : "success"}>{failed ? "Failed" : "Success"}</Chip>
                        </Row>
                        <Row label="Message">{entry.message}</Row>
                    </dl>

                    {targetPath && (
                        <Link to={targetPath} className="dtl-link">
                            View {entry.targetType.toLowerCase()}
                        </Link>
                    )}
                </Card>

                {showChanges && (
                    <Card title="Changes">
                        <div className="adm-json-grid">
                            <div>
                                <p className="adm-subtext">Before</p>
                                <Json value={entry.changes.before ?? {}} />
                            </div>
                            <div>
                                <p className="adm-subtext">After</p>
                                <Json value={entry.changes.after ?? {}} />
                            </div>
                        </div>
                    </Card>
                )}

                {hasKeys(entry.metadata) && (
                    <Card title="Details">
                        <Json value={entry.metadata} />
                    </Card>
                )}
            </div>
        </AdminModal>
    );
};

export default ActivityDetailsModal;