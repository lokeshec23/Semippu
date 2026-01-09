import React, { createContext, useContext, useState, useEffect } from 'react';

import { API_BASE_URL } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = (id) => {
        setUserId(id);
        localStorage.setItem('userId', id);
    };

    const logout = () => {
        setUserId(null);
        setUser(null);
        localStorage.removeItem('userId');
    };

    const fetchUser = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, user, loading, login, logout, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};
