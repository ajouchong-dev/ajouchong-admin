import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("jwtToken");
        return {
            isAuthenticated: !!token,
            token,
            user: null,
            loading: true,
        };
    });

    const logout = useCallback(() => {
        localStorage.removeItem("jwtToken");
        setAuth({ isAuthenticated: false, token: null, user: null, loading: false });
    }, []);

    const fetchUser = useCallback(async (token) => {
        try {
            const response = await apiClient.get(`/api/login/auth/info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (response.status === 200) {
                const userData = response.data;
                setAuth((prev) => ({
                    ...prev,
                    user: userData,
                    loading: false,
                }));
            } else {
                throw new Error("유저 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        }
    }, [logout]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            fetchUser(token);
        } else {
            setAuth((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    }, [fetchUser]);

    const login = (token, user) => {
        localStorage.setItem("jwtToken", token);
        setAuth({ isAuthenticated: true, token, user, loading: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
