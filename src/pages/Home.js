import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { addDoc, collection,doc, getDoc, onSnapshot, orderBy, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, firestoreDb, storage } from "../firebase";
import { query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([])
  
  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(firestoreDb, "users");

    // 다른 사람의 user정보 및 채팅데이터를 가져옴.
    // not-in 쿼리는 지정된 필드가 존재하고 null 이 아니며 비교 값과 일치하지 않는 문서를 반환
    const q = query(usersRef, where("uid", "not-in", [user1]));

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
  
  // 다른 유저 선택하기
  const selectUser = async (user) => {
    // 선택한 유저 chat에 정보 담기
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    // 상대방과 나눈 대화 정보 가져오기
    const msgsRef = collection(firestoreDb, "messages", id, "chat")
    const q = query(msgsRef, orderBy("createdAt", 'asc'))
    
    onSnapshot(q, (querySnapshot) => {
      let msgs = []
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })
    
    //로그인한 사용자와, 선택한 사용자에 대한 마지막 메시지 가져오기
    //사용자를 선택하면 다음과 같이 마지막 메시지 읽지 않음이 읽음으로표시됨.
    const docSnap = await getDoc(doc(firestoreDb, 'lastMsg', id))
    //마지막 메시지가 존재하고 메시지가 선택된 사용자로부터 온 경우
    if(docSnap.data() && docSnap.data().from !== user1) {
      //마지막 메시지 문서를 업데이트하고 읽지 않음을 false로 설정
      await updateDoc(doc(firestoreDb, 'lastMsg', id), {unread: false})
    }
  };



  // 메시지 전송 submit 핸들러
  const messageSendHandleSubmit = async (event) => {
    event.preventDefault();

    // 전송하고자 하는 상대방 uid 확인
    const user2 = chat.uid;

    //데이터베이스 아이디 생성하기
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    //이미지 전송하기 storage에 이미지 업로드하기
    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );

      const snap = await uploadBytes(imgRef, img);

      // getDownloadURL 메서드를 호출하여 파일의 다운로드 url을 가져옴
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

      url = dlUrl;
    }

    // 메시지 addDoc으로 문서 저장하기 - collection 필요
    await addDoc(collection(firestoreDb, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

      // setDoc으로 문서 저장 - collection 필요하지 않고 새 collection 생성
      // 읽지 않은 마지막 메시지 표시하기 
      await setDoc(doc(firestoreDb, 'lastMsg', id), {
        text,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || "",
        unread: true,
      })

    setText("");
    setImg("")
  };


  return (
    <Home_container>
      <Users_container>
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat} />
        ))}
      </Users_container>
      <Messages_container>
        {chat ? (
          <>
            <Messages_user>
              <h3>{chat.name}</h3>
            </Messages_user>

            <Messages>
              {msgs.length ? msgs.map((msg, index) => (
                <Message key={index} msg={msg} user1={user1}  />
              )) : null }

            </Messages>

            <MessageForm
              text={text}
              setText={setText}
              setImg={setImg}
              messageSendHandleSubmit={messageSendHandleSubmit}
            />
          </>
        ) : (
          <h3 className="no_conversation">대화 상대를 선택하세요 😝</h3>
        )}
      </Messages_container>
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

  @media screen  and (max-width: 767px) {
    grid-template-columns: 2fr 3fr;
  }

  @media screen and (max-width: 576px) {
    grid-template-columns: 1fr 5fr;
  }

`;

const Users_container = styled.div`
  margin-top: 10px;
  border-right: 2px solid #eee;
  overflow-y: auto;
`;

const Messages_container = styled.div`
  position: relative;
  width: 100%;
  .no_conversation {
    font-size: 20px;
    color: #263159;
    text-align: center;
    margin-top: 20px;
  }
`;

const Messages_user = styled.div`
  padding: 10px;
  text-align: center;
  border-bottom: 2px solid #eee;
`;

const Messages = styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
  border-bottom: 1px solid #eee;
`

export default Home;
