import React from 'react'

const PRODUCTS = [
    { id: 1, name: 'T-shirt', price: 249 },
    { id: 2, name: 'Sneakers', price: 4999 },
    { id: 3, name: 'Mug', price: 199 }
]

export default function Shop({ onAdd }) {
    return (
        <div className="card">
            <h2>Shop</h2>
            <div className="products">
                {PRODUCTS.map(p => (
                    <div key={p.id} className="product">
                        <div className="title">{p.name}</div>
                        <div className="price">₹{p.price}</div>
                        <button onClick={() => onAdd(p)}>Add to cart</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
