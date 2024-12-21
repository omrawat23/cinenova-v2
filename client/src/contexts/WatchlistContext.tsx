import { auth } from "@/config/firebase"
import { ReactNode, useContext, useEffect, useState } from "react"


const AuthContext = createContext({
  user: null,
  login: ()=> {},
  logout: ()=> {},
  isAuthenticated: false
})

export const AuthProvider: React.FC<{children: ReactNode}> = ({children})=> {
  const [user,setUser] = useState(null)
  const [isAuthenticated,setIsAuthenticated] = useState(false)

  useEffect(()=> {
    const storedUser = localStorage.getItem('user')

    if(storedUser){
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
console.error('error')
localStorage.removeItem('user')
      }
    }else{
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if(firebaseUser){
          const userData = {
            uuid:
          }
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem('user',JSON.stringify(userData))

        }else{
          setUser(null)
          setIsAuthenticated(false)
        }
      })
      return ()=> unsubscribe();
    }
  },[])

  const contextValue = {
    user
  }

  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=> {
  const context = useContext(AuthContext)
}