import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import PageHeader from "../../../components/dashboard/shared/PageHeader";
import { findAdminItem } from "../../../components/dashboard/sidebar/sidebarConfig";
import UsersTab from "../../../components/admin/users/UsersTab";
import InvitationsTab from "../../../components/admin/users/InvitationsTab";
import InviteModal from "../../../components/admin/users/InviteModal";

const UserManagementPage = () => {
    const [params, setParams] = useSearchParams();

    const tab = params.get("tab") === "invitations" ? "invitations" : "users";
    const [inviteOpen, setInviteOpen] = useState(params.get("invite") === "1");
    const [invitesVersion, setInvitesVersion] = useState(0);

    const selectTab = (next) => setParams(next === "users" ? {} : { tab: next }, { replace: true });

    const closeInvite = () => {
        setInviteOpen(false);

        if (params.get("invite")) {
            const next = new URLSearchParams(params);
            next.delete("invite");
            setParams(next, { replace: true });
        }
    };

    const handleInvited = () => {
        setInviteOpen(false);
        setInvitesVersion((version) => version + 1);
        selectTab("invitations");
    };

    return (
        <div className="adm-page">
            <PageHeader title="User Management" subtitle={findAdminItem("users")?.description}>
                <button type="button" className="btn btn-primary" onClick={() => setInviteOpen(true)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Invite User
                </button>
            </PageHeader>

            <div className="adm-tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "users"}
                    className={`adm-tab ${tab === "users" ? "active" : ""}`}
                    onClick={() => selectTab("users")}
                >
                    Users
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "invitations"}
                    className={`adm-tab ${tab === "invitations" ? "active" : ""}`}
                    onClick={() => selectTab("invitations")}
                >
                    Invitations
                </button>
            </div>

            {tab === "users" ? <UsersTab /> : <InvitationsTab key={invitesVersion} />}

            {inviteOpen && <InviteModal onClose={closeInvite} onInvited={handleInvited} />}
        </div>
    );
};

export default UserManagementPage;