# Firebase를 이용한 간단한 채팅 앱 프로젝트
-  Firebase를 이용해 react 채팅 앱을 구현

## 데모사이트
- https://dahyeblog.github.io/react-chat-app-firebase/

## 구현한 내용
- 회원가입, 로그인
- 프로필창에서 프로필 사진을 업데이트 및 삭제
- 홈화면에 채팅 화면 구현

## 폴더 상세설명
```bash 

```

## 사용한 도구 및 라이브러리
- react, firebase v9
- npm i styled-components
- npm i react-router-dom@6.3.0
- npm i react-moment


## 강의를 통해 배운 것
### 프로필 사진 저장하고, 저장된 사진 불러와 업데이트 하기
```bash 

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
          
          setImg("");
        } catch (error) {
          alert(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  ```

### 프로필 사진 storage 삭제
```bash
  // 프로필 사진 삭제하고 firestorage 업데이트 하기
  const deleteImage = async () => {
    try {
      const confirm = window.confirm('삭제를 원하세요?')
      if(confirm) {
        await deleteObject(ref(storage, user.avatarPath))
        await updateDoc(doc(firestoreDb, "users", auth.currentUser.uid), {
          avatar:"",
          avatarPath:""
        })
        navigate('/')
      }
    } catch (error) {
      alert(error.message)
    }
  };
```

### useEffect 의 return 기능 이란?
-  만약 의존성이 있다면, clean-up이 매번 해당 useEffect가 실행되기 전에 실행된다. 

### Private Router의 구현 v6
- 반드시 인증(로그인)을 해야만 접근 가능한 페이지(프로필 페이지, 홈 화면 페이지)
- 위와 같이 페이지의 구분이 생겼기에, 로그인 여부에 대해 체크 하는 역할을 해주는 Private Router를 구현함. 
- 만약 로그인 하지 않았는데, 주소창으로 home 페이지나, 프로필 페이지로 가고자 한다면, 바로 로그인 페이지로 이동하도록 구현함.
- https://www.robinwieruch.de/react-router-private-routes/


### 이미지 전송하기 storage에 이미지 업로드하기
   ```bash
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
    ```

