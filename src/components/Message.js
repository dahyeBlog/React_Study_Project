import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Moment from "react-moment";
import "moment/locale/ko";

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <Message_wrapper
      className={msg.from === user1 ? "own" : ""}
      ref={scrollRef}
    >
      {/* user1 은 현재 접속한 본인 임. */}
      <p className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small>
          {/* 현재 시간으로 부터 몇시간 전.. 표시 라이브러리 */}
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </Message_wrapper>
  );
};

const Message_wrapper = styled.div`
  margin-top: 5px;
  padding: 0px 5px;
  &.own {
    text-align: right;
  }

  img {
    width: 100%;
    border-radius: 5px;
  }

  p {
    padding: 10px;
    display: inline-block;
    max-width: 50%;
    text-align: left;
    border-radius: 5px;
  }

  small {
    display: inline-block;
    margin-top: 15px;
    opacity: 0.8;
  }

  .me {
    background-color: #0084ff;
    color: white;
  }
  .friend {
    background: #eee;
    color: #444444;
  }

  @media screen and (max-width: 767px) {
    p {
      max-width: 75%;
    }
  }

  @media screen and (max-width: 576px) {
    p {
      max-width: 100%;
    }
  }
`;

export default Message;
