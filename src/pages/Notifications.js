import React from "react";

function Notifications() {
    return (
        <section className="notifications-section">
            <h2>Notifications</h2>
            <div className="notification-list">
                <div className="notification-item">
                    <span className="notification-time">Just Now</span>
                    <p>You have been outbid on “Vintage Watch.”</p>
                </div>
                <div className="notification-item">
                    <span className="notification-time">1 hour ago</span>
                    <p>Your auction for “Old Book” just received a new bid.</p>
                </div>
            </div>
        </section>
    );
}

export default Notifications;
