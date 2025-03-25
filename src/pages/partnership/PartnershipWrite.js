import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import "./PartnershipWrite.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PartnershipWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        imageFiles.forEach((file) => {
            formData.append('imageFiles', file);
        });

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/admin/partnership`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert('제휴가 등록되었습니다.');
                navigate('/partnership');
            } else {
                setError(response.data.message || '제휴 등록에 실패했습니다.');
            }
        } catch (error) {
            setError('제휴 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ps-write-container">
            <h2>제휴 작성</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="ps-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제휴 게시물의 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="제휴 내용을 입력하세요"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>이미지 업로드 </label>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? '등록 중...' : '제휴 등록'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/partnership')}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );

};

export default PartnershipWrite;