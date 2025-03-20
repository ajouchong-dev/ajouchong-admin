import React from 'react';
import './App.css';
import Menu from './components/menu/menu';
import Login from './components/login/Login';
import Notice from './pages/notice/Notice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">
      <Menu />
      
      <div className="content-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/notice" element={<Notice />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
