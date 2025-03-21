import React from 'react';
import './App.css';
import Menu from './components/menu/menu';
import Login from './components/login/Login';
import Notice from './pages/notice/Notice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./context/AuthContext";

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
            </Routes>
        </>
    );
}

export default App;
