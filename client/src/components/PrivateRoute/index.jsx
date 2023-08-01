import React from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
    const token = localStorage.getItem('access_token')
    console.log('private')
    if (token) {
        return children
    }
    return <Navigate to="/login" replace />
}

export default PrivateRoute