import React, { useState } from 'react'

export default function Login({ onLogin, onCancel }) {
    const [email, setEmail] = useState('')

    function submit(e) {
        e.preventDefault()
        const v = email.trim()
        if (!v) return alert('Enter your email')
        onLogin(v)
    }

    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={submit}>
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                <div className="row">
                    <button type="submit">Login</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
