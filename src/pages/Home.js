import React, { useEffect, useState } from "react";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, firestoreDb } from "../firebase";
import { query, where } from "firebase/firestore";
import User from "../components/User";
import styled from "styled-components";

const Home = () => {
  const [users, setUsers] = useState([]);

  const userId = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(firestoreDb, "users");

    // 다른 사람의 user정보 및 채팅데이터를 가져옴.
    // not-in 쿼리는 지정된 필드가 존재하고 null 이 아니며 비교 값과 일치하지 않는 문서를 반환
    const q = query(usersRef, where("uid", "not-in", [userId]));

    // 쿼리 실행하기
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });

    //위의 코드가 완료되면, 실행됨
    return () => unsubscribe();
  }, []);
  console.log(users);
  return (
    <Home_container>
      <Users_container>
        {users.map((user) => (
          <User key={user.uid} user={user} />
        ))}
      </Users_container>
    </Home_container>
  );
};



const Home_container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  overflow: hidden;
  height: calc(100vh - 70px);
  width: 100vw;
`;

const Users_container = styled.div`
  margin-top: 10px;
  border-right: 2px solid #eee;
  overflow-y: auto;
`;

export default Home;
