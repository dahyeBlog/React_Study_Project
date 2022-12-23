import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { auth, firestoreDb } from "../firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  // data 정보 따로 빼옴
  const { name, email, password, error, loading } = data;

  // form안의 data를 설정하기
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // form 정보 저장하고 회원가입하기
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 정보를 보내면 다음과 같이 loading안의 값이 true로 바뀌어 내용이 변한다.
    setData({ ...data, error: null, loading: true });

    // input 안의 내용이 없다면, 다음과 같은 오류를 구현하도록 한다.
    if (!name || !email || !password) {
      setData({ ...data, error: alert("회원가입에 필요한 정보를 입력하세요~ 🤓") });
    }

    // 암호 기반 계정 회원가입하기.
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // form안에 있는 정보 문서 저장
      await setDoc(doc(firestoreDb, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });

      setData({
        name: "",
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
      <h3>회원가입</h3>
      <RegisterForm onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">이름</label>
          <input type="text" name="name" onChange={handleChange} value={name} />
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={password}
          />
        </div>

        {error ? <p className="error">{error}</p> : null}
        <div className="btnContainer">
          <button disabled={loading}>
            {loading ? "가입중...⏳" : "회원가입"}
          </button>
        </div>
      </RegisterForm>
    </section>
  );
};

const RegisterForm = styled.form`
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

export default Register;
