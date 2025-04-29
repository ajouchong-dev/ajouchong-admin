import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import './Agora.css';

const AgoraPage = () => {
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
            const response = await axios.get(`https://www.ajouchong.com/api/agora`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(post => ({
                    id: post.apostId,
                    title: post.apTitle,
                    author: post.author,
                    date: new Date(post.createTime).toLocaleDateString(),
                    status: post.approve ? '가결' : '진행중',
                }));
                setPosts(fetchedPosts);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
            setError('Agora 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (postId) => {
        if (!window.confirm("정말로 게시글을 삭제하시겠습니까?")) return;

        try {
            const response = await axios.delete(`https://www.ajouchong.com/api/admin/agora/${postId}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert("게시글이 삭제되었습니다.");
                fetchPosts();
                navigate("/agora");
            } else {
                console.error("Error deleting post:", response.data.message);
                alert("게시글을 삭제하는데 실패했습니다.");
            }
        } catch (error) {
            console.error("API request error:", error);
            alert("게시글을 삭제하는 중 오류가 발생했습니다.");
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
        <div className="agora-container">
            <div className="agora-header">
                <h3 className="agora-title">{posts.length}개의 안건이 있습니다.</h3>
            </div>

            <table className="agora-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>상태</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {currentPosts.map((post) => (
                    <tr key={post.id} onClick={(e) => navigate(`/agora/${post.id}`)}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{post.date}</td>
                        <td className={post.status === "가결" ? "ok" : "pending"}>
                            {post.status}
                        </td>
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

}

export default AgoraPage;