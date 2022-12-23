import { onAuthStateChanged } from 'firebase/auth'
import React, {useState, useEffect} from 'react'
import { auth } from '../firebase'
import Loading from '../components/Loading'

export const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // firebase의 인증이 되었다면 로그인을 유지하는 인증 메서드
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {      
      setUser(user)
      setLoading(false)
    })
  }, [])

  // 로그인이 되지 않았을때 나타나는 로딩 표시
  if(loading) {
    return <Loading />
  }

  return (
    <AuthContext.Provider value={{user}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
