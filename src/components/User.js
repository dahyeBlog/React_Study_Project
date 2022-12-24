import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firestoreDb } from "../firebase";
import Img from "../img.png";
const User = ({ user, selectUser, user1, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  // 마지막 메시지 가져오기
  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsubscribe = onSnapshot(doc(firestoreDb, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <User_wrapper
        className={chat.name === user.name && "selected_user"}
        onClick={() => selectUser(user)}
      >
        <User_info>
          <User_detail>
            <img
              src={user.avatar || Img}
              alt="profile_img"
              className="pofile_img"
            />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </User_detail>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </User_info>
        {data && (
          <p className="lastMsg">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {data.text}
          </p>
        )}
      </User_wrapper>

      <Small_container onClick={() => selectUser(user)}>
        <img
          src={user.avatar || Img}
          className="pofile_img small_screen"
          alt="pofile_img"
        />
      </Small_container>
    </>
  );
};

const User_wrapper = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;

  &.selected_user {
    background: #eee;
  }
  .user_status {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .online {
    background: #34eb52;
  }
  .offline {
    background: #eb4034;
  }

  .lastMsg {
    font-size: 14px;
    white-space: nowrap;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lastMsg strong {
    margin-right: 10px;
  }

  @media screen and (max-width: 576px) {
    display: none;
  }
`;

const User_info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const User_detail = styled.div`
  display: flex;
  align-items: center;

  .pofile_img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #eee;
  }

  h4 {
    margin-left: 10px;
  }

  .unread {
    margin-left: 10px;
    background: #0084ff;
    color: #fff;
    padding: 2px 4px;
    border-radius: 10px;
  }
`;

const Small_container = styled.div`
  padding: 10px 0px;
  text-align: center;
  cursor: pointer;

  .small_screen {
    display: none;
  }
  @media screen and (max-width: 576px) {
    .pofile_img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid #eee;
    }

    .small_screen {
      display: inline-block;
    }
  }
`;
export default User;
