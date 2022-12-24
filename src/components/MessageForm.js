import React, { useState } from "react";
import styled from "styled-components";
import Attachment from "./svg/Attachment";

const MessageForm = ({ messageSendHandleSubmit, text, setText, setImg }) => {
  return (
    <Message_form onSubmit={messageSendHandleSubmit}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        type="file"
        id="img"
        onChange={(e) => setImg(e.target.files[0])}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="메시지를 전송하세요."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn">전송</button>
      </div>
    </Message_form>
  );
};

const Message_form = styled.form`
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;

  input {
    width: 40vw;
    margin: 0px 10px 10px;
    padding: 10px;
    outline: none;
    border: none;
  }

  .btn {
    cursor: pointer;
    margin-top: -10px;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #eee;
    background: #eee;
    font-size: 16px;
    transition: 0.3s ease-in-out all;
  }
  .btn:hover {
    transform: scale(1.05);
  }

  @media screen and (max-width: 767px) {
    left: 3%;
    right: 0;
    bottom: 5px;
  }
`;

export default MessageForm;
