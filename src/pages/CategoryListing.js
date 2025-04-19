import React from "react";

function CategoryListing() {

    const sampleItems = [
        { id: 101, title: "Smartphone", currentBid: 100, buyNow: 150 },
        { id: 102, title: "Laptop", currentBid: 400, buyNow: 500 },
        { id: 103, title: "Smartwatch", currentBid: 80, buyNow: 120 },
    ];

    return (
        <section className="category-listing-section">
            <h2>Electronics Category</h2>

            <div className="item-list">
                {sampleItems.map((item) => (
                    <div className="item-card" key={item.id}>
                        <img
                            src="https://via.placeholder.com/150"
                            alt={item.title}
                            className="item-image"
                        />
                        <h3>{item.title}</h3>
                        <p>Current Bid: ${item.currentBid}</p>
                        <p>Buy Now: ${item.buyNow}</p>
                        <button>View Details</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategoryListing;
