import React from "react";

function Categories() {
    const categories = [
        { id: 1, name: "Electronics", description: "Phones, tablets, etc." },
        { id: 2, name: "Fashion", description: "Clothing, accessories, more." },
        { id: 3, name: "Home & Garden", description: "Furniture, tools, etc." },
        { id: 4, name: "Collectibles", description: "Rare items, memorabilia." },
    ];

    return (
        <section className="categories-section">
            <h2>Browse Categories</h2>
            <div className="category-list">
                {categories.map((cat) => (
                    <div className="category-card" key={cat.id}>
                        <h3>{cat.name}</h3>
                        <p>{cat.description}</p>
                        <button>View {cat.name}</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Categories;
