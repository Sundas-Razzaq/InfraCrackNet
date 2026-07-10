import "../../styles/profile.css";

const Profile = () => {
    return (
        <div className="profile-page">

            {/* Header */}
            <div className="profile-page-header">
                <div>
                    <h1 className="profile-page-title">My Profile</h1>

                    <p className="profile-page-subtitle">
                        Manage your personal information and account settings
                    </p>
                </div>

                <button className="btn-primary profile-page-save-btn">
                    Save Changes
                </button>
            </div>

            {/* Main Content */}
            <div className="profile-page-content">

                {/* Left Card */}
                <aside className="profile-page-sidebar card">

                    <div className="profile-page-avatar-wrapper">

                        <div className="profile-page-avatar">
                            SF
                        </div>

                        <h2 className="profile-page-name">
                            Sadia Farooq
                        </h2>

                        <span className="profile-page-role badge badge-info">
                            Engineer
                        </span>

                        <p className="profile-page-member-since">
                            Member since Jan 2024
                        </p>

                        <button className="btn-secondary profile-page-photo-btn">
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

                {/* Form */}
                <section className="profile-page-form card">

                    <div className="card-header">
                        <h2 className="card-title">
                            Personal Information
                        </h2>
                    </div>

                    <form>

                        <div className="profile-page-grid">

                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="Sadia"
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Farooq"
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="sadiafarooq@gmail.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="text"
                                placeholder="+92 123 4567891"
                            />
                        </div>

                        <div className="form-group">
                            <label>Organization</label>

                            <input
                                type="text"
                                placeholder="International Crack Detection"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role / Position</label>

                            <input
                                type="text"
                                placeholder="Senior Officer"
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio</label>

                            <textarea
                                rows="5"
                                placeholder="Experienced structural engineer specializing in bridge infrastructure."
                            />
                        </div>

                        <div className="profile-page-grid">

                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );
};

export default Profile;