import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./linkHub.css";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const LinkHub = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const linksPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    const navigate = useNavigate();

    const fetchLinks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/api/admin/link`, {
                withCredentials: true,
            });

            console.log("Link response:", response.data);
            
            if (response.data.code === 1) {
                setLinks(response.data.data || []);
            } else {
                console.error('Error fetching links:', response.data.message);
                setError('링크 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error("링크 불러오기 실패:", error);
            setError('링크 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const deleteLink = async (id) => {
        if (!window.confirm(`${id}번 링크를 삭제하시겠습니까?`)) return;

        setLoading(true);
        try {
            const response = await apiClient.delete(`/api/admin/link/${id}/delete`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert(`${id}번 링크 삭제 성공!`);
                fetchLinks(); 
            } else {
                console.error("Error deleting link:", response.data.message);
                alert("링크 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("링크 삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLink(null);
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

    const indexOfLastLink = currentPage * linksPerPage;
    const indexOfFirstLink = indexOfLastLink - linksPerPage;
    const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);
    const totalPages = Math.ceil(links.length / linksPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h3 className="admin-title">{links.length}개의 링크가 있습니다.</h3>
                <button className="write-btn" onClick={() => navigate(`/linkhub/write`)}>링크 등록</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>링크 제목</th>
                    <th>URL</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="4">로딩 중...</td>
                    </tr>
                ) : currentLinks.length > 0 ? (
                    currentLinks.map((link) => (
                        <tr key={link.id} onClick={() => openModal(link)}>
                            <td>{link.id}</td>
                            <td>{link.title}</td>
                            <td>
                                <a 
                                    href={link.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="link-url"
                                >
                                    {link.link}
                                </a>
                            </td>                          
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLink(link.id);
                                    }}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">등록된 링크가 없습니다.</td>
                    </tr>
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

            {showModal && selectedLink && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>×</button>
                        <h2>{selectedLink.title}</h2>
                        <p><strong>URL:</strong></p>
                        <p>
                            <a 
                                href={selectedLink.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="modal-link"
                            >
                                {selectedLink.link}
                            </a>
                        </p>
                        <p><strong>생성일:</strong></p>
                        <p>{new Date(selectedLink.createdAt).toLocaleString('ko-KR')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkHub;
