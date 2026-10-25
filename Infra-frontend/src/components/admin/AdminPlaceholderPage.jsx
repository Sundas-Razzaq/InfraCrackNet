import { faHammer } from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../dashboard/shared/PageHeader";
import EmptyState from "../dashboard/shared/EmptyState";
import { findAdminItem } from "../dashboard/sidebar/sidebarConfig";

const AdminPlaceholderPage = ({ itemId }) => {
    const item = findAdminItem(itemId);

    return (
        <div className="adm-page">
            <PageHeader
                title={item?.title || "Admin"}
                subtitle={item?.description || ""}
            />
            <EmptyState
                icon={faHammer}
                title="Coming in the next step"
                message="This screen is wired into the sidebar and routing. Its content is built in a later step."
            />
        </div>
    );
};

export default AdminPlaceholderPage;