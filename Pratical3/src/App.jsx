import React, { useState } from 'react'
import Login from './Login'
import Admin from './Admin'
import Student from './Student'

export default function App() {
    const [user, setUser] = useState(null)
    function handleLogin(u) {
        setUser(u)
    }
    function handleLogout() {
        setUser(null)
    }
    if (!user) return <Login onLogin={handleLogin} />
    if (user === 'admin') return <Admin onLogout={handleLogout} />
    return <Student onLogout={handleLogout} />
}
