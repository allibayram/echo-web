import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'https://ecograde-broker1.onrender.com';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for saved session
        const savedToken = localStorage.getItem('ecograde_token');
        const savedUser = localStorage.getItem('ecograde_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || 'GiriÅŸ baÅŸarÄ±sÄ±z');
        }
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('ecograde_token', data.access_token);
        localStorage.setItem('ecograde_user', JSON.stringify(data.user));
        return data.user;
    };

    const register = async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_name: userData.companyName,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'user'
            })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || 'KayÄ±t baÅŸarÄ±sÄ±z');
        }
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('ecograde_token', data.access_token);
        localStorage.setItem('ecograde_user', JSON.stringify(data.user));
        return data.user;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ecograde_token');
        localStorage.removeItem('ecograde_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

