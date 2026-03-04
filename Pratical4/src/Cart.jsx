import React from 'react'

export default function Cart({ items, onRemove, onUpdate, onCheckout }) {
    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

    return (
        <div className="card">
            <h2>Your Cart</h2>
            {items.length === 0 ? <p>Cart is empty</p> : (
                <>
                    <ul className="cart-list">
                        {items.map(i => (
                            <li key={i.product.id}>
                                <div className="cart-item">
                                    <div>{i.product.name}</div>
                                    <div>₹{i.product.price}</div>
                                    <div>
                                        <input type="number" min="1" value={i.qty} onChange={e => onUpdate(i.product.id, Math.max(1, +e.target.value))} />
                                    </div>
                                    <div>
                                        <button onClick={() => onRemove(i.product.id)}>Remove</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">Total: ₹{total}</div>
                    <div className="row">
                        <button onClick={onCheckout}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    )
}
