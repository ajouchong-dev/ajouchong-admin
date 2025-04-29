import React, {useEffect} from 'react';
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import './login.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = ({ user, setUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data: userInfo } = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    }
                );

                // console.log("Google User Info:", userInfo);

                const refreshToken = Cookies.get("refreshToken") || null;

                const { data: backendData } = await axios.post(
                    `${BASE_URL}/api/login/auth/oauth`,
                    {
                        accessToken: tokenResponse.access_token,
                        refreshToken: refreshToken,
                    },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const { data } = backendData;
                const jwtToken = data.jwtToken;

                if (jwtToken) {

                    setUser(userInfo);
                    localStorage.setItem("user", JSON.stringify(userInfo));

                    navigate("/member");
                } else {
                    console.error("JWT가 존재하지 않습니다.");
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.error("JWT 만료됨 - 로그아웃 처리");
                    logout();
                } else {
                    console.error("Login Error:", error);
                }
            }
        },
        onError: (error) => console.error("Login Failed:", error),
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        access_type: "offline",
        prompt: "consent",
        hosted_domain: "ajou.ac.kr",
    });

    const logout = async () => {
        try {
            await axios.post(`${BASE_URL}/api/login/auth/logout`,
                {},
                { withCredentials: true }
            );

            googleLogout();
            setUser(null);

            localStorage.removeItem("user");
            Cookies.remove("refreshToken");
            Cookies.remove("accessToken");

            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="login-container">
            <h1>Ajouchong Admin</h1>
            {user ? (
                <button className="auth-button" onClick={logout}>
                    Logout
                </button>
            ) : (
                <button onClick={signInWithGoogle} className="auth-button">
                    Login
                </button>
            )}
        </div>
    );
};

export default Login;