import React from "react";

function AdminPanel() {
    return (
        <section className="admin-panel-section">
            <h2>Admin Panel</h2>
            <div className="admin-controls">
                <button>Manage Users</button>
                <button>Manage Listings</button>
                <button>Review Disputes</button>
            </div>
            <div className="admin-content">
                <h3>Platform Statistics</h3>
                <ul>
                    <li>Total Users: 120</li>
                    <li>Active Listings: 45</li>
                    <li>Resolved Disputes: 10</li>
                </ul>
            </div>
        </section>
    );
}

export default AdminPanel;
