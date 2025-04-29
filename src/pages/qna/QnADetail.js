import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QnADetail.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const QnADetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answerSubmitting, setAnswerSubmitting] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    const fetchPost = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/qna/${id}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const postData = response.data.data;
                setPost(postData);

                if (postData.answer) {
                    setAnswer(postData.answer.content);
                    setIsAnswered(true);
                }
            } else {
                console.error("Error fetching data:", response.data.message);
                setError("게시글을 불러오는데 실패했습니다.");
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
    }, [fetchPost]);

    const submitAnswer = async () => {
        if (!answer.trim()) {
            alert("답변을 입력하세요.");
            return;
        }

        setAnswerSubmitting(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/admin/qna/${id}/answer`,
                { content: answer },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.data.code === 1) {
                alert("답변이 등록되었습니다.");
                setIsAnswered(true);
                fetchPost();
            } else {
                console.error("Error submitting answer:", response.data.message);
                alert("답변을 등록하는데 실패했습니다.");
            }
        } catch (error) {
            console.error("API request error:", error);
            alert("답변을 등록하는 중 오류가 발생했습니다.");
        } finally {
            setAnswerSubmitting(false);
        }
    };

    const deleteAnswer = async () => {
        if (!window.confirm("답변을 삭제하시겠습니까?")) return;

        try {
            const response = await axios.delete(`${BASE_URL}/api/admin/qna/${id}/answer`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert("답변이 삭제되었습니다.");
                setAnswer("");
                setIsAnswered(false);
            } else {
                console.error("Error deleting answer:", response.data.message);
                alert("답변을 삭제하는데 실패했습니다.");
            }
        } catch (error) {
            console.error("API request error:", error);
            alert("답변을 삭제하는 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <div className="qna-detail-container">
            <h2>{post.qpTitle}</h2>
            <div className="qna-info">
                <span>작성자: {post.qpAuthor}</span>
                <span>작성일: {new Date(post.qpCreateTime).toLocaleString("ko-KR")}</span>
                <span className={isAnswered ? "completed" : "pending"}>
                    {isAnswered ? "답변 완료" : "대기 중"}
                </span>
            </div>
            <div className="qna-content">
                <p>{post.qpContent}</p>
            </div>

            <button className="back-button" onClick={() => navigate("/qna")}>목록으로</button>

            <div className="reply-container">
                <h3>답변 입력</h3>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="답변을 입력하세요..."
                    rows="4"
                    disabled={isAnswered}
                />
                <div className="button-group">
                    {!isAnswered && (
                        <button
                            className="submit-button"
                            onClick={submitAnswer}
                            disabled={answerSubmitting}
                        >
                            {answerSubmitting ? "등록 중..." : "답변 등록"}
                        </button>
                    )}
                    {isAnswered && (
                        <button className="delete-button" onClick={deleteAnswer}>
                            답변 삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QnADetail;
