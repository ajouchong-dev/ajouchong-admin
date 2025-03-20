import React from 'react';
import './menu.css';

const Menu = () => {
    return (
      <header className="main-header">
        <div className="top-bar">
          <div className="top-links">
            <span><a href='/'>메인 페이지</a></span>
          </div>
        </div>
        <div className="logo">
          <img src="aurum_white.png" alt="아우름 로고" className="logo-image" /> {/* 로고 이미지 추가 */}
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="/introduce">소개</a></li>
            <li><a href="/notice">소식</a></li>
            <li><a href="/communicate">소통</a></li>
            <li><a href="/reference">자료실</a></li>
            <li><a href="/welfare">학생복지</a></li>
          </ul>
        </nav>
      </header>
    );
}

export default Menu;
