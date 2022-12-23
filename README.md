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
- react, firebase
- npm i styled-components
- npm i react-router-dom@6.3.0

## 강의를 통해 배운 것
- 프로필 사진의 업로드 및 삭제, 업데이트 기능

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


