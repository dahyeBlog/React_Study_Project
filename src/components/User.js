import { list } from "firebase/storage";
import React from "react";
import styled from "styled-components";
import Img from "../img.png";
const User = ({ user }) => {
  console.log(user);

  return (
    // className={chat.name === user.name && "selected_user"}
    <User_wrapper>
      <User_info>
        <User_detail>
          <img
            src={user.avatar || Img}
            alt="profile_img"
            className="pofile_img"
          />
          <h4>{user.name}</h4>
        </User_detail>
        <div
          className={`user_status ${user.isOnline ? "online" : "offline"}`}
        ></div>
      </User_info>
    </User_wrapper>
  );
};

const User_wrapper = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;

  .selected_user {
    background: red;
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
`;
export default User;
