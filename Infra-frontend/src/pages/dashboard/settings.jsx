import DashboardLayout from "../../layouts/DashboardLayout";
import "../../styles/settings.css";

const Settings = () => {
    return (
        <>
            <div className="settings-page">

                {/* Header */}

                <div className="settings-header">

                    <div>
                        <h1 className="settings-title">
                            Settings
                        </h1>

                        <p className="settings-subtitle">
                            Manage platform preferences, notifications and security
                        </p>
                    </div>

                    <button className="btn-primary">
                        Save All Changes
                    </button>

                </div>

                {/* Top Section */}

                <div className="settings-grid">

                    {/* Notification Preferences */}

                    <section className="card settings-card">

                        <div className="card-header">
                            <h2 className="card-title">
                                Notification Preferences
                            </h2>
                        </div>

                        <div className="settings-list">

                            <div className="settings-item">
                                <div>
                                    <h4>Critical severity alerts</h4>
                                    <p>Notify immediately — always on</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div>
                                    <h4>AI analysis completion</h4>
                                    <p>When AI finishes processing</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div>
                                    <h4>Report approvals</h4>
                                    <p>On approve or reject</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div>
                                    <h4>Inspection reminders</h4>
                                    <p>Upcoming inspection alerts</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div>
                                    <h4>Team activity</h4>
                                    <p>New team member actions</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div>
                                    <h4>System updates</h4>
                                    <p>Platform updates & news</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>

                        </div>

                    </section>

                    {/* Right Column */}

                    <div className="settings-right-column">

                        {/* Security */}

                        <section className="card settings-card">

                            <div className="card-header">
                                <h2 className="card-title">
                                    Security
                                </h2>
                            </div>

                            <div className="settings-list">

                                <div className="settings-item">

                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Not enabled — Add extra security</p>
                                    </div>

                                    <button className="btn-secondary btn-sm">
                                        Enable
                                    </button>

                                </div>

                                <div className="settings-item">

                                    <div>
                                        <h4>Active Sessions</h4>
                                        <p>2 devices currently signed in</p>
                                    </div>

                                    <button className="btn-secondary btn-sm">
                                        Manage
                                    </button>

                                </div>

                                <div className="settings-item">

                                    <div>
                                        <h4>API Access Keys</h4>
                                        <p>Manage API integrations</p>
                                    </div>

                                    <button className="btn-secondary btn-sm">
                                        View Keys
                                    </button>

                                </div>

                            </div>

                        </section>

                        {/* Appearance */}

                        <section className="card settings-card">

                            <div className="card-header">
                                <h2 className="card-title">
                                    Appearance & Language
                                </h2>
                            </div>

                            <div className="form-group">

                                <label className="form-label">
                                    Theme
                                </label>

                                <div className="theme-selector">

                                    <button className="theme-option active">
                                        Light Mode (Active)
                                    </button>

                                    <button className="theme-option">
                                        Dark Mode
                                    </button>

                                </div>

                            </div>

                            <div className="form-group">

                                <label className="form-label">
                                    Language
                                </label>

                                <select>
                                    <option>English</option>
                                    <option>Urdu</option>
                                </select>

                            </div>

                        </section>

                    </div>

                </div>

                {/* AI Preferences */}

                <section className="card settings-card">

                    <div className="card-header">
                        <h2 className="card-title">
                            AI & Analysis Preferences
                        </h2>
                    </div>

                    <div className="ai-settings">

                        <div className="confidence-setting">

                            <div className="confidence-header">
                                <span>
                                    Default Confidence Threshold: <strong>80%</strong>
                                </span>
                            </div>

                            <input
                                type="range"
                                min="50"
                                max="99"
                                defaultValue="80"
                            />

                            <div className="range-labels">
                                <span>50%</span>
                                <span>80%</span>
                                <span>99%</span>
                            </div>

                        </div>

                        <div className="settings-item">

                            <div>
                                <h4>Auto-generate reports after AI analysis</h4>
                            </div>

                            <div className="settings-inline">

                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                    />
                                    <span className="slider"></span>
                                </label>

                                <span className="enabled-text">
                                    Enabled
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </div>
        </>
    );
};

export default Settings;