import React, { useState } from 'react'
import Login from './Login'
import Shop from './Shop'
import Cart from './Cart'
import Checkout from './Checkout'

export default function App() {
    const [user, setUser] = useState(null)
    const [view, setView] = useState('shop')
    const [cart, setCart] = useState([])

    function handleLogin(email) {
        setUser({ email })
        setView('shop')
    }

    function handleLogout() {
        setUser(null)
        setCart([])
        setView('shop')
    }

    function addToCart(product) {
        setCart(prev => {
            const found = prev.find(i => i.product.id === product.id)
            if (found) {
                return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
            }
            return [...prev, { product, qty: 1 }]
        })
    }

    function removeFromCart(productId) {
        setCart(prev => prev.filter(i => i.product.id !== productId))
    }

    function updateQty(productId, qty) {
        setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
    }

    function handleCheckout() {
        setView('checkout')
    }

    function handlePaymentSuccess() {
        setCart([])
        setView('shop')
        alert('Payment successful — thank you!')
    }

    return (
        <div className="app">
            <header>
                <h1>Simple Shopping App</h1>
                <nav>
                    <button onClick={() => setView('shop')}>Shop</button>
                    <button onClick={() => setView('cart')}>Cart ({cart.reduce((s, i) => s + i.qty, 0)})</button>
                    {user ? (
                        <>
                            <span className="user">{user.email}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <button onClick={() => setView('login')}>Login</button>
                    )}
                </nav>
            </header>

            <main>
                {!user && view === 'login' && <Login onLogin={handleLogin} onCancel={() => setView('shop')} />}
                <Shop onAdd={addToCart} />
                {view === 'cart' && <Cart items={cart} onRemove={removeFromCart} onUpdate={updateQty} onCheckout={handleCheckout} />}
                {view === 'checkout' && <Checkout items={cart} onPay={handlePaymentSuccess} onCancel={() => setView('cart')} user={user} />}
            </main>
        </div>
    )
}
