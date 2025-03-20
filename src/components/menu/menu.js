import React from 'react';
import './menu.css';

const Menu = () => {
    return (
      <div id="main-menu">
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
