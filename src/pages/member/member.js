import { useEffect, useState } from "react";
import axios from "axios";
import "./member.css";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const Member = () => {
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [newRole, setNewRole] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await apiClient.get(`/api/admin/members`, {
                    withCredentials: true
                });

                if (response.data.code === 1) {
                    setMembers(response.data.data);
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        };

        fetchMembers();
    }, []);

    const totalPages = Math.ceil(members.length / membersPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((memberId) => memberId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedMembers.length === members.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(members.map((member) => member.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedMembers.length === 0) return;

        try {
            await Promise.all(
                selectedMembers.map(async (id) => {
                    await apiClient.delete(`/api/admin/members/${id}`, {
                        withCredentials: true,
                    });
                })
            );

            setMembers((prev) => prev.filter((member) => !selectedMembers.includes(member.id)));
            setSelectedMembers([]);
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
        }
    };

    const handleRowClick = (member) => {
        setSelectedMember(member);
        setNewRole(member.role);
    };

    const handleCloseModal = () => {
        setSelectedMember(null);
        setSelectedMembers([]);
    };

    const handleChangeRole = async () => {
        if (!selectedMember) return;

        try {
            const response = await apiClient.put(`/api/admin/members/${selectedMember.id}`,
                { role: newRole },
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                setMembers((prev) =>
                    prev.map((member) =>
                        member.id === selectedMember.id ? { ...member, role: newRole } : member
                    )
                );
                alert("권한이 성공적으로 변경되었습니다.");
                handleCloseModal();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("권한 변경 중 오류 발생:", error);
            alert("권한 변경 실패");
        }
    };

    return (
        <div className="members-container">
            <h3 className="members-title">{members.length}명의 회원이 검색되었습니다.</h3>
            <table className="members-table">
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedMembers.length === members.length}
                        />
                    </th>
                    <th>ID</th>
                    <th>이름</th>
                    <th>E-mail</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member) => (
                    <tr key={member.id}
                        className="clickable-row"
                        onClick={(e) => {
                            if (e.target.type !== "checkbox") {
                                handleRowClick(member);
                            }
                        }}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={() => handleCheckboxChange(member.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </td>
                        <td>{member.id}</td>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td className={`role-${member.role.toLowerCase()}`}>{member.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className="delete-btn" onClick={handleDeleteSelected} disabled={selectedMembers.length === 0}>
                    선택 삭제
                </button>

                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    ◀ 이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    다음 ▶
                </button>
            </div>

            {selectedMember && (
                <div className="modal-overlay">
                    <div className="modal-content">
                    <h3>회원 정보</h3>
                        <p><strong>ID:</strong> {selectedMember.id}</p>
                        <p><strong>이름:</strong> {selectedMember.name}</p>
                        <p><strong>Email:</strong> {selectedMember.email}</p>
                        <p><strong>현재 권한:</strong> {selectedMember.role}</p>

                        <label htmlFor="role-select"><strong>새로운 권한: </strong></label>
                        <select id="role-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="COUNCIL">COUNCIL</option>
                        </select>

                        <div className="modal-buttons">
                            <button onClick={handleChangeRole}>권한 변경</button>
                            <button onClick={handleCloseModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Member;
