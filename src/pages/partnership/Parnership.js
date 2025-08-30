import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import './Partnership.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const Partnership = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [])

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/partnership`, {
                withCredentials: true,
            });

            console.log(response.data.data);

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(post => ({
                    id: post.psPostId,
                    title: post.psTitle,
                    date: new Date(post.psCreateTime).toLocaleDateString(),
                }));
                setPosts(fetchedPosts);
        } else {
                console.error('Error fetching data:', response.data.message);
                setError('제휴 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('API request error:', error);
            setError('제휴목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }

    const deletePost = async (id) => {
        if (!window.confirm(`${id}번 제휴를 삭제하시겠습니까?`)) return;

        setLoading(true);
        try {
            const response = await apiClient.delete(`/api/admin/partnership/${id}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert(`${id}번 제휴가 삭제되었습니다.`);
                fetchPosts();
            } else {
                setError(response.data.message || "제휴 삭제에 실패했습니다.");
            }
        } catch (error) {
            setError("제휴 삭제 중 오류가 발생했습니다.");
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
        <div className="ps-container">
            <div className="ps-header">
                <h3 className="ps-title">{posts.length}개의 제휴가 있습니다.</h3>
                <button className="write-btn" onClick={() => navigate('/partnership/write')}>제휴 등록</button>
            </div>

            <table className="ps-table">
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

export default Partnership