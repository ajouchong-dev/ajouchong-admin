import React from 'react';
import './login.css'; // 스타일링 파일이 필요하다면 임포트


const Login = () => {
    return (
        <>
              <main className="login-section">
        <form className="login-form">
          <h2>AJOU UNIV</h2>
          <br></br>
          <h1>관리자 계정 로그인</h1>
          <br></br>
          <div className="login-input">
            <input type="email" placeholder="email" className="input-field" />
            <input type="password" placeholder="password" className="input-field" />
            <button type="submit" className="login-button">log in</button>
          </div>
        </form>
      </main>
        </>
    );
}

export default Login;
