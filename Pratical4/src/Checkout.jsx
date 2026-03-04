import React, { useState } from 'react'

export default function Checkout({ items, onPay, onCancel, user }) {
    const [name, setName] = useState(user?.email || '')
    const [card, setCard] = useState('')

    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

    function submit(e) {
        e.preventDefault()
        if (!name || !card) return alert('Enter name and card number (mock)')
        setTimeout(() => onPay(), 400)
    }

    return (
        <div className="card">
            <h2>Checkout</h2>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <form onSubmit={submit}>
                    <div className="field">
                        <label>Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Card number</label>
                        <input value={card} onChange={e => setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="cart-total">Amount: ₹{total}</div>
                    <div className="row">
                        <button type="submit">Pay</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    )
}
