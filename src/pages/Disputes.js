import React from "react";

function Disputes() {
    return (
        <section className="disputes-section">
            <h2>Dispute Resolution Center</h2>
            <div className="dispute-form">
                <h3>Open a New Dispute</h3>
                <form>
                    <label>
                        Auction Item:
                        <input type="text" placeholder="Enter item title or ID" />
                    </label>
                    <label>
                        Reason:
                        <textarea placeholder="Describe the issue" />
                    </label>
                    <button type="submit">Submit Dispute</button>
                </form>
            </div>
            <div className="my-disputes">
                <h3>My Disputes</h3>
                <p>No open disputes at this time.</p>
            </div>
        </section>
    );
}

export default Disputes;
