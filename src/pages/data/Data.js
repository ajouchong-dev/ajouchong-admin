import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Data.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Data = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ruleType, setRuleType] = useState('OFFICIAL');

    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [currentPage, ruleType]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/data?type=${ruleType}`, {
                withCredentials: true,
            });

            console.log(response.data.data);

            setPosts(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        if (!window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) return;

        setLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/data/${id}`, {
                withCredentials: true,
            });

            if(response.data.code === 1) {
                alert(`${id}번 게시글 삭제 성공!`);
                fetchPosts();
            } else {
                console.error("Error deleting post:", response.data.message);
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h3 className="admin-title">{posts.length}개의 {ruleType} 게시글이 있습니다.</h3>
                <button className="write-btn" onClick={() => navigate(`${BASE_URL}/admin/data/create`)}>게시글 등록</button>
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
                    <tr><td colSpan="5">로딩 중...</td></tr>
                ) : (
                    posts.map((post) => (
                        <tr key={post.rpostId}>
                            <td>{post.rpostId}</td>
                            <td>{post.rpTitle}</td>
                            <td>{post.rpContent}</td>
                            <td>{post.ruleType}</td>
                            <td>
                                <button className="delete-btn" onClick={() => deletePost(post.rpostId)}>삭제</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>◀ 이전</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>다음 ▶</button>
            </div>
        </div>
    );
};

export default Data;
