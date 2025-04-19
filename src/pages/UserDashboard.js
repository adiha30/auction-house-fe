import React from "react";

function UserDashboard() {
    return (
        <section className="user-dashboard-section">
            <h2>My Dashboard</h2>
            <div className="dashboard-content">
                <div className="profile">
                    <h3>Profile Info</h3>
                    <p>Username: JohnDoe</p>
                    <p>Email: johndoe@example.com</p>
                </div>

                <div className="my-auctions">
                    <h3>My Auctions</h3>
                    <ul>
                        <li>Item A - Bids: 5, Highest Bid: $30</li>
                        <li>Item B - Bids: 2, Highest Bid: $15</li>
                    </ul>
                </div>

                <div className="my-bids">
                    <h3>My Bids</h3>
                    <ul>
                        <li>Bid on “Item C”: $40 (Highest bidder? Yes)</li>
                        <li>Bid on “Item D”: $25 (Outbid)</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default UserDashboard;
