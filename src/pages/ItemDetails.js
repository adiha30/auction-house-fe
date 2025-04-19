import React from "react";

function ItemDetails() {
    return (
        <section className="item-details-section">
            <div className="item-details-card">
                <img
                    src="https://via.placeholder.com/300"
                    alt="Detailed Item"
                    className="item-details-image"
                />
                <div className="item-info">
                    <h2>Item Title</h2>
                    <p className="item-description">
                        This is a more detailed description of the item. It might include
                        specs, condition, and any special notes.
                    </p>
                    <p className="item-price">Current Bid: $50</p>
                    <p className="buy-now-price">Buy Now: $75</p>
                    <button>Place Bid</button>
                    <button>Buy Now</button>
                </div>
            </div>
        </section>
    );
}

export default ItemDetails;
