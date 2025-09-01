import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./linkHub.css";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const LinkHubWrite = () => {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !link.trim()) {
            alert("제목과 링크를 입력해주세요.");
            return;
        }

        try {
            new URL(link);
        } catch {
            alert("올바른 URL 형식을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const requestData = {
                title: title,
                link: link
            };

            const response = await apiClient.post(`/api/admin/link/upload`, requestData, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert("링크가 성공적으로 등록되었습니다!");
                navigate("/linkHub");
            } else {
                alert("링크 등록에 실패했습니다.");
            }
        } catch (error) {
            setError("링크 등록 중 오류가 발생했습니다.");
            console.error("링크 등록 실패:", error);
            alert("링크 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="link-write-container">
            <h2>링크 등록</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="link-form">
                <div className="form-group">
                    <label>링크 제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="링크 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>링크 URL</label>
                    <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://example.com"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={() => navigate("/linkHub")}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "등록 중..." : "링크 등록"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LinkHubWrite;
