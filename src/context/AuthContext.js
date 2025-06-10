import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
            const response = await fetch(`https://www.ajouchong.com/api/login/auth/info`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const userData = await response.json();
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
