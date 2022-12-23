import React, { useState, useEffect } from "react";
import Img from "../img.png";
import Camera from "../components/svg/Camera";
import Delete from "../components/svg/Delete";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firestoreDb, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // 저장한 사용자 유저의 데이터 가져오기
    getDoc(doc(firestoreDb, "users", auth.currentUser.uid)).then((doSnap) => {
      if (doSnap.exists) {
        setUser(doSnap.data());
      }
    });

    // 선택한 프로필 사진을 Firebase storage에 저장하기
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          // 적절한 참조를 만든 다음에 uploadBytes() 메서드를 호출한다.
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          // 이미지 업로드 시 Firestore 데이터 업데이트
          await updateDoc(doc(firestoreDb, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          alert("프로필 사진이 변경되었습니다.👏");
          setImg("");
        } catch (error) {
          alert(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  // 프로필 사진 삭제하고 firestorage 업데이트 하기
  const deleteImage = async () => {
    try {
      const confirm = window.confirm("삭제를 원하세요?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(firestoreDb, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        alert("프로필 사진이 변경되었습니다.👏");
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return user ? (
    <section>
      <ProfileDiv>
        <div className="profile_img">
          <img src={user.avatar || Img} alt="img" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
        </div>
      </ProfileDiv>
    </section>
  ) : null;
};

const ProfileDiv = styled.div`
  display: flex;
  align-items: center;

  .profile_img {
    position: relative;
    margin-right: 20px;
    cursor: pointer;
  }
  .profile_img img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transition: 0.5s ease-in-out all;
    border: 1px solid #eee;
  }

  .profile_img:hover img {
    opacity: 0.4;
  }

  .profile_img:hover .overlay {
    opacity: 1;
  }

  .overlay {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .text_container {
    flex-grow: 1;
  }
  .text_container h3 {
    text-align: left;
  }
`;
export default Profile;
