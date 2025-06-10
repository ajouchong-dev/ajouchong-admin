import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./QnA.css";

const QnA = () => {
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
            const response = await axios.get(`https://www.ajouchong.com/api/qna`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const formattedPosts = response.data.data.map(post => ({
                    id: post.qpostId,
                    title: post.qpTitle,
                    author: post.qpAuthor,
                    date: new Date(post.qpCreateTime).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                    status: post.replied ? "답변완료" : "대기중"
                }));
                setPosts(formattedPosts);
            } else {
                console.error('Error fetching data:', response.data.message);
                setError('QnA 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('API request error:', error);
            setError('QnA 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (postId) => {
        if (!window.confirm("정말로 게시글을 삭제하시겠습니까?")) return;

        try {
            const response = await axios.delete(`https://www.ajouchong.com/api/admin/qna/${postId}`, {
                withCredentials: true,
            });

            if (response.data.code === 1) {
                alert("게시글이 삭제되었습니다.");
                fetchPosts();
                navigate("/qna");
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

    return (
        <div className="qna-container">
            <h2>QnA 게시판</h2>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <table className="qna-table">
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
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                            <tr key={post.id} onClick={() => navigate(`/qna/${post.id}`)}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.date}</td>
                                <td className={post.status === "답변완료" ? "completed" : "pending"}>
                                    {post.status}
                                </td>
                                <td>
                                    <button className="delete-button" onClick={() => deletePost(post.id)}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">게시글이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QnA;