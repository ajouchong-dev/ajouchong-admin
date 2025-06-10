import React, {useState} from 'react';
import './menu.css';
import Login from "../login/Login";
import {useAuth} from "../../context/AuthContext";

const Menu = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState(auth.user);

    return (
      <div id="main-menu">
          <Login user={user} setUser={setUser} />
          <ul className="side-menu">
              <li><a href="/member">회원 관리</a></li>
              <li><a href="/notice">공지사항</a></li>
              <li><a href="/qna">Q&A</a></li>
              <li><a href="/agora">100인 안건 상정제</a></li>
              <li><a href="/data">세칙 및 회칙</a></li>
              <li><a href="/partnership">제휴백과</a></li>
          </ul>
      </div>
    );
}

export default Menu;
