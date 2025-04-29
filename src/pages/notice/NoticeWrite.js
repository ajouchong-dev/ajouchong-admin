import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './noticeWrite.css';

const NoticeWrite = () => {
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
            const response = await axios.post(`https://www.ajouchong.com/api/admin/notice`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert('공지사항이 등록되었습니다.');
                navigate('/notice');
            } else {
                setError(response.data.message || '공지사항 등록에 실패했습니다.');
            }
        } catch (error) {
            setError('공지사항 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notice-write-container">
            <h2>공지사항 작성</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="공지사항 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="공지사항 내용을 입력하세요"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>이미지 업로드 (여러 개 가능)</label>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? '등록 중...' : '공지사항 등록'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/notice')}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeWrite;
