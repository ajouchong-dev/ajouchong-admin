import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import './AgoraDetail.css';

const AgoraDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [approve, setApprove] = useState(false);
    const [approving, setApproving] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPost = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://www.ajouchong.com/api/agora/${id}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const post = response.data.data;
                setPost(post);

                if (post.approve) {
                    setApprove(true);
                }
            } else {
                console.error('게시글 조회 오류:', response.data.message);
            }
        } catch (error) {
            console.error("API request error:", error);
            setError("게시글을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]); // 이제 안전하게 의존성에 넣을 수 있음

    const handleApprove = async () => {
        setApproving(true);
        try {
            const response = await axios.put(
                `https://www.ajouchong.com/api/admin/agora/${id}/approve`,
                {},
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                alert("게시글이 승인되었습니다.");
                setApprove(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("승인 요청 오류:", error);
            alert("승인 처리 중 오류가 발생했습니다.");
        } finally {
            setApproving(false);
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <div className="agora-detail-container">
            <h2>안건 제목: {post.apTitle}</h2>
            <div className="agora-info">
                <span>작성자: {post.author}</span>
                <span>작성일: {post.updateTime}</span>
                <span>좋아요: {post.apUserLikeCount}개</span>
                <span className={approve ? "ok" : "pending"}>
                    {approve ? "가결" : "진행중"}
                </span>
            </div>
            <div className="agora-content">
                <p>{post.apContent}</p>
            </div>

            <div className="button-group">
                <button className="back-button" onClick={() => navigate("/agora")}>
                    목록으로
                </button>

                {!approve && (
                    <button
                        className="approve-button"
                        onClick={handleApprove}
                        disabled={approving}
                    >
                        {approving ? "대기중" : "안건 승인"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AgoraDetail;