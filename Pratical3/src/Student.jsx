import React from 'react'

export default function Student({ onLogout }) {
    return (
        <div className="card">
            <h2>Welcome, Student!</h2>
            <p>This is the student welcome page.</p>
            <button onClick={onLogout}>Logout</button>
        </div>
    )
}
