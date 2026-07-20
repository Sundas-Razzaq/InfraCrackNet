import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import PasswordInput from "../../components/common/PasswordInput";
import { toast } from "react-toastify";

import {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
} from "../../api/profileApi";

import { getApiErrorMessage } from "../../api/authApi";

function Profile() {
    const { updateUser } = useAuth();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        bio: "",
        role: "",
        profileImage: "",
        createdAt: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] =
        useState(false);
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
                    profileImage: data.user.profileImage?.url || "",
                    createdAt: data.user.createdAt || "",
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

            const data = await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                organization: formData.organization,
                position: formData.position,
                bio: formData.bio,
            });

            setFormData((prev) => ({
                ...prev,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || "",
                organization:
                    data.user.organization || "",
                position: data.user.position || "",
                bio: data.user.bio || "",
                role: data.user.role,
                profileImage:
                    data.user.profileImage?.url || "",
            }));

            updateUser(data.user);

            toast.success(
                "Profile updated successfully."
            );
        } catch (err) {
            toast.error(
                getApiErrorMessage(
                    err,
                    "Failed to update profile."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        try {
            setUploadingPhoto(true);

            const data =
                await uploadProfilePhoto(file);

            setFormData((prev) => ({
                ...prev,
                profileImage:
                    data.user.profileImage?.url || "",
            }));

            updateUser(data.user);

            event.target.value = "";

            toast.success(
                "Profile photo updated successfully."
            );
        } catch (err) {
            toast.error(
                getApiErrorMessage(
                    err,
                    "Failed to upload profile photo."
                )
            );
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        try {
            setChangingPassword(true);

            await changePassword(passwordData);

            toast.success(
                "Password updated successfully."
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            toast.error(
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
    const formatMemberSince = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

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
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoUpload}
                            disabled={saving}
                        />
                        <div className="profile-page-avatar">

                            {formData.profileImage ? (
                                <img
                                    src={formData.profileImage}
                                    alt={formData.name}
                                    className="profile-page-avatar-image"
                                />
                            ) : (
                                formData.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                            )}

                        </div>

                        <h2 className="profile-page-name">
                            {formData.name}
                        </h2>

                        <span className="profile-page-role badge badge-info">
                            {formData.role}
                        </span>

                        <p className="profile-page-member-since">
                            Member since {formatMemberSince(formData.createdAt)}
                        </p>

                        <button
                            className="btn-secondary profile-page-photo-btn"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                        >
                            {uploadingPhoto
                                ? "Uploading..."
                                : "Change Photo"}
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
                                    disabled={saving}
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
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label>Organization</label>

                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>

                            <input
                                type="text"
                                value={formData.role}
                                disabled={saving} />
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
                            <PasswordInput
                                label="Current Password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                disabled={changingPassword}
                            />
                        </div>

                        <div className="form-group">
                            <PasswordInput
                                label="New Password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                disabled={changingPassword}
                            />
                        </div>

                        <div className="form-group">
                            <PasswordInput
                                label="Confirm Password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                disabled={changingPassword}
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