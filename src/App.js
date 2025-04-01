import React from 'react';
import './App.css';
import Menu from './components/menu/menu';
import Login from './components/login/Login';
import Notice from './pages/notice/Notice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./context/AuthContext";
import Member from "./pages/member/member";
import NoticeWrite from "./pages/notice/NoticeWrite";
import QnA from "./pages/qna/QnA";
import QnADetail from "./pages/qna/QnADetail";
import Agora from "./pages/agora/Agora";
import AgoraDetail from "./pages/agora/AgoraDetail";
import Partnership from "./pages/partnership/Parnership";
import PartnershipWrite from "./pages/partnership/PartnershipWrite";
import Data from "./pages/data/Data";
import DataWrite from "./pages/data/DataWrite";

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
                <Route path="/qna" element={<QnA/>} />
                <Route path="/qna/:id" element={<QnADetail/>} />
                <Route path="/agora" element={<Agora/>} />
                <Route path="/agora/:id" element={<AgoraDetail/>} />
                <Route path="/partnership" element={<Partnership/>} />
                <Route path="/partnership/write" element={<PartnershipWrite/>} />
                <Route path="/data" element={<Data />} />
                <Route path="/data/write" element={<DataWrite />} />
            </Routes>
        </>
    );
}

export default App;
