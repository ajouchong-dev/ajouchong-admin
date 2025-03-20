import React from 'react';
import './App.css';
import Header from './components/Menu';
import Login from './components/Login';
import Notice from './components/Notice';
import Introduce from './components/Introduce';
import Communicate from './components/Communicate';
import Reference from './components/Reference';
import Welfare from './components/Welfare';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from "./components/menu/menu";

function App() {
  return (
    <div className="app-container">
      <Menu />
      
      <div className="content-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/introduce" element={<Introduce />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/communicate" element={<Communicate />} />
            <Route path="/reference" element={<Reference />} />
            <Route path="/welfare" element={<Welfare />} />
          </Routes>
        </BrowserRouter>
      </div>

      <footer className="footer"> {/* 푸터 */}
        <div className="footer-links">
          <a href="#privacy-policy">개인정보 처리방침</a>
          <span>|</span>
          <a href="#terms">회원가입약관</a>
        </div>
        <div className="address">
          16399) 경기도 수원시 영통구 월드컵로 206 아주대학교 학생생활관 208호
        </div>
        <div className="copyright">
          COPYRIGHT Ajou University Student Council. ALL Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default App;
