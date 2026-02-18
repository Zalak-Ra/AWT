import React from 'react'

export default function Admin({ onLogout }) {
    return (
        <div className="card">
            <h2>Welcome, Admin!</h2>
            <p>This is the admin welcome page.</p>
            <button onClick={onLogout}>Logout</button>
        </div>
    )
}
