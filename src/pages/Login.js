import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, firestoreDb } from "../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const navigate = useNavigate();

  const { email, password, error, loading } = data;

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // 이메일과 비밀번호 로그인하기
  const handleSubmit = async (event) => {
    event.preventDefault();
    setData({ ...data, error: null, loading: true });

    if (!email || !password) {
      setData({
        ...data,
        error: alert("이메일 과 비밀번호를 입력해주세요 🤓"),
      });
    }

    try {
      // 로그인 메서드로 로그인 구현
      const result = await signInWithEmailAndPassword(auth, email, password);

      // 로그인 성공 시 데이터 수정
      await updateDoc(doc(firestoreDb, "users", result.user.uid), {
        isOnline: true,
      });

      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      navigate("/");
    } catch (error) {
      setData({ ...data, error: error.message, loading: false });
    }
  };

  return (
    <section>
      <h3>로그인</h3>
      <LoginForm onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btnContainer">
          {/* disabled값을 지정하면, 특정 조건이 충족될때 까지 데이터가 제출 되지 않음 */}
          <button disabled={loading}>
            {loading ? "로그인중..." : "로그인"}
          </button>
        </div>
      </LoginForm>
    </section>
  );
};

const LoginForm = styled.form`
  margin-top: 30px;
  padding: 0px 20px;

  div {
    margin-top: 15px;
  }
  div label {
    font-size: 15px;
    letter-spacing: 1px;
  }
  div input {
    width: 100%;
    padding: 5px;
    outline: none;
    margin-top: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
  }

  .btnContainer {
    margin: 10px 0px;
    text-align: center;
  }
  .btnContainer button {
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #eee;
    cursor: pointer;
    background-color: #263159;
    color: #fff;
    font-weight: bold;
    transition: 0.3s ease-in-out all;
    &:hover {
      background-color: #eee;
      color: #263159;
    }
  }

  .error {
    margin-top: 20px;
    text-align: center;
    color: #990000;
  }
`;

export default Login;
