import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Data.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Data = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ruleType, setRuleType] = useState('OFFICIAL');

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/data?type=${ruleType}`, {
                withCredentials: true,
            });

            console.log(response.data.data);
            setPosts(response.data.data);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [ruleType]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const deletePost = async (id) => {
        if (!window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) return;

        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/data/${id}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert(`${id}번 게시글 삭제 성공!`);
                fetchPosts(); // 삭제 후 갱신
            } else {
                console.error("Error deleting post:", response.data.message);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            closeModal();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h3 className="admin-title">{posts.length}개의 {ruleType} 게시글이 있습니다.</h3>
                <button className="write-btn" onClick={() => navigate(`/data/write`)}>게시글 등록</button>
            </div>

            {/* OFFICIAL, DETAIL 탭 버튼 */}
            <div className="tab-buttons">
                <button className={ruleType === "OFFICIAL" ? "active" : ""} onClick={() => setRuleType("OFFICIAL")}>회칙</button>
                <button className={ruleType === "DETAIL" ? "active" : ""} onClick={() => setRuleType("DETAIL")}>세칙</button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>규칙 제목</th>
                    <th>내용</th>
                    <th>타입</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="5">로딩 중...</td>
                    </tr>
                ) : (
                    currentPosts.map((post) => (
                        <tr key={post.rpostId} onClick={() => openModal(post)}>
                            <td>{post.rpostId}</td>
                            <td>{post.rpTitle}</td>
                            <td>{post.rpContent}</td>
                            <td>{post.ruleType}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePost(post.rpostId);
                                    }}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))
                )}
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

            {showModal && selectedPost && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>×</button>
                        <h2>{selectedPost.rpTitle}</h2>
                        <p>{selectedPost.rpContent}</p>
                        <p>
                            Link:{" "}
                            <a href={selectedPost.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                {selectedPost.attachmentUrl}
                            </a>
                        </p>
                        <span className="modal-type">{selectedPost.ruleType}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Data;
