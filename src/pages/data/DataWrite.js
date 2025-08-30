import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./DataWrite.css";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const DataWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [ruleType, setRuleType] = useState('OFFICIAL');  // 기본값 설정
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const requestData = {
                rpTitle: title,
                rpContent: content,
                attachmentUrl: attachmentUrl,
                ruleType: ruleType
            };

            const response = await apiClient.post(`/api/admin/data`, requestData, {
                withCredentials: true,
            });

            alert(response.data.message);
            navigate("/data");
        } catch (error) {
            setError("게시글 작성 중 오류가 발생했습니다.");
            console.error("게시글 작성 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-write-container">
            <h2>게시글 작성</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="data-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>타입 선택</label>
                    <select value={ruleType} onChange={(e) => setRuleType(e.target.value)}>
                        <option value="OFFICIAL">OFFICIAL</option>
                        <option value="DETAIL">DETAIL</option>
                    </select>

                    <label>파일 링크(URL)</label>
                    <input
                        type="text"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        placeholder="파일 URL을 입력하세요"
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "업로드 중..." : "게시글 작성"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DataWrite;
