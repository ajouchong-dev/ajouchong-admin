import React from 'react';
import './App.css';
import Menu from './components/menu/menu';
import Login from './components/login/Login';
import Notice from './pages/notice/Notice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./context/AuthContext";
import Member from "./pages/member/member";
import NoticeWrite from "./pages/notice/NoticeWrite";

function App() {
  return (
      <AuthProvider>
        <div className="app-container">
            <BrowserRouter>
            <Menu />
      
            <div className="content-wrapper">
                <Content/>
            </div>
            </BrowserRouter>
        </div>
      </AuthProvider>
  );
}

const Content = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/notice/write" element={<NoticeWrite />} />
                <Route path="/member" element={<Member />} />
            </Routes>
        </>
    );
}

export default App;
