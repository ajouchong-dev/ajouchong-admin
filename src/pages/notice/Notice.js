import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './notice.css';

const Notice = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://www.ajouchong.com/api/notice`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(post => ({
                    id: post.npost_id,
                    imageUrl: post.imageUrls[0] || '/achim_square.jpeg',
                    title: post.npTitle,
                    date: new Date(post.npCreateTime).toLocaleDateString(),
                }));
                setPosts(fetchedPosts);
            } else {
                console.error('Error fetching data:', response.data.message);
                setError('공지사항을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('API request error:', error);
            setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        if (!window.confirm(`${id}번 공지사항을 삭제하시겠습니까?`)) return;

        setLoading(true);
        try {
            const response = await axios.delete(`https://www.ajouchong.com/api/admin/notice/${id}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert(`${id}번 공지사항이 삭제되었습니다.`);
                fetchPosts();
            } else {
                setError(response.data.message || "공지사항 삭제에 실패했습니다.");
            }
        } catch (error) {
            setError("공지사항 삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h3 className="notice-title">{posts.length}개의 공지사항이 있습니다.</h3>
                <button className="write-btn" onClick={() => navigate('/notice/write')}>공지사항 작성</button>
            </div>

            <table className="notice-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {currentPosts.map((post) => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.date}</td>
                        <td>
                            <button className="delete-btn" onClick={() => deletePost(post.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    ◀ 이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    다음 ▶
                </button>
            </div>
        </div>
    );
};

export default Notice;
