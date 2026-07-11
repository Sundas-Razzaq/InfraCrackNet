import { useEffect, useState } from "react";

import "../../styles/profile.css";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../api/profileApi";

import { getApiErrorMessage } from "../../api/authApi";

function Profile() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        bio: "",
        role: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();

                setFormData({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    organization:
                        data.user.organization || "",
                    position: data.user.position || "",
                    bio: data.user.bio || "",
                    role: data.user.role || "",
                });

                setError("");
            } catch (err) {
                setError(
                    getApiErrorMessage(
                        err,
                        "Failed to load profile."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                organization: formData.organization,
                position: formData.position,
                bio: formData.bio,
            });

            alert("Profile updated successfully.");
        } catch (err) {
            alert(
                getApiErrorMessage(
                    err,
                    "Failed to update profile."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        try {
            setChangingPassword(true);

            await changePassword(passwordData);

            alert("Password updated successfully.");

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            alert(
                getApiErrorMessage(
                    err,
                    "Failed to update password."
                )
            );
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-page">
            <div className="profile-page-header">
                <div>
                    <h1 className="profile-page-title">
                        My Profile
                    </h1>

                    <p className="profile-page-subtitle">
                        Manage your personal information and account
                        settings
                    </p>
                </div>

                <button
                    className="btn-primary profile-page-save-btn"
                    type="submit"
                    form="profileForm"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="profile-page-content">
                <aside className="profile-page-sidebar card">
                    <div className="profile-page-avatar-wrapper">
                        <div className="profile-page-avatar">
                            {formData.name
                                ? formData.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "U"}
                        </div>

                        <h2 className="profile-page-name">
                            {formData.name}
                        </h2>

                        <span className="profile-page-role badge badge-info">
                            {formData.role}
                        </span>

                        <p className="profile-page-member-since">
                            Member since Jan 2024
                        </p>

                        <button
                            className="btn-secondary profile-page-photo-btn"
                            type="button"
                        >
                            Change Photo
                        </button>
                    </div>

                    <div className="profile-page-divider"></div>

                    <div className="profile-page-activity">
                        <h3>Activity Summary</h3>

                        <div className="profile-page-activity-item">
                            <span>Reports Generated</span>
                            <strong>18</strong>
                        </div>

                        <div className="profile-page-activity-item">
                            <span>Inspections Reviewed</span>
                            <strong>47</strong>
                        </div>

                        <div className="profile-page-activity-item">
                            <span>Projects Assigned</span>
                            <strong>5</strong>
                        </div>

                        <div className="profile-page-activity-item">
                            <span>Last Active</span>
                            <strong>Today</strong>
                        </div>
                    </div>
                </aside>

                <section className="profile-page-form card">
                    <div className="card-header">
                        <h2 className="card-title">
                            Personal Information
                        </h2>
                    </div>

                    <form
                        id="profileForm"
                        onSubmit={handleSubmit}
                    >
                        <div className="profile-page-grid">
                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Organization</label>

                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>

                            <input
                                type="text"
                                value={formData.role}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio</label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="5"
                            />
                        </div>
                    </form>

                    <hr className="profile-page-divider" />

                    <div className="card-header">
                        <h2 className="card-title">
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>

                            <input
                                type="password"
                                name="currentPassword"
                                value={
                                    passwordData.currentPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>

                            <input
                                type="password"
                                name="newPassword"
                                value={
                                    passwordData.newPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={
                                    passwordData.confirmPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                            />
                        </div>
                        <br />
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={changingPassword}
                        >
                            {changingPassword
                                ? "Updating..."
                                : "Update Password"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Profile;