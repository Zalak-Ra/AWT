import React, { useState } from 'react'

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    function submit(e) {
        e.preventDefault()
        const eVal = email.trim().toLowerCase()

        if (eVal === 'student@gmail.com') {
            onLogin('student')
            return
        }
        
        if (eVal === 'admin@gmail.com') {
            onLogin('admin')
            return
        }
        
        alert('Unknown email. Use student@gmail.com or admin@gmail.com')
    }
    
    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={submit}>
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
