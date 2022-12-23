import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { auth, firestoreDb } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 로그아웃 기능
  const handleSignout = async () => {
    //문서의 일부 필드를 업데이트
    await updateDoc(doc(firestoreDb, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Nav>
      <h3>
        <Link to="/">😎💜 Chat App</Link>
      </h3>

      <NavWrapper>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleSignout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">회원가입</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </NavWrapper>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0px 20px;
  background-color: #263159;

  a {
    cursor: pointer;
    color: #fff;
    text-decoration: none;
    font-size: 18px;
  }
`;

const NavWrapper = styled.div`
  margin-right: 20px;
  a {
    margin-left: 20px;
  }
  button {
    margin-left: 20px;
    cursor: pointer;
    font-size: 18px;
  }
`;

export default Navbar;
