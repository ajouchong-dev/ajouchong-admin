import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QnADetail.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const QnADetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/qna/${id}`, {
                withCredentials: true,
            });

            console.log(response.data.data);

            if (response.data.code === 1) {
                setPost(response.data.data);
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
                <span className={post.replied ? "completed" : "pending"}>
                    {post.replied ? "답변 완료" : "대기 중"}
                </span>
            </div>
            <div className="qna-content">
                <p>{post.qpContent}</p>
            </div>
            <button className="back-button" onClick={() => navigate("/qna")}>목록으로</button>
        </div>
    );
};

export default QnADetail;
