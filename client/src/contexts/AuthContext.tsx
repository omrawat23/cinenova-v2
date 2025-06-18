import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode
} from 'react'
import { auth } from "@/config/firebase"
import axios from 'axios'

// User type definition
export interface User {
  uuid: string
  username: string
  email: string
  imageUrl: string
}

// Authentication Context Type
interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
})

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Initialize authentication state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    } else {
      // Check Firebase auth for active session
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          const userData: User = {
            uuid: firebaseUser.uid,
            username: firebaseUser.displayName || "Unknown",
            email: firebaseUser.email || "No email",
            imageUrl: firebaseUser.photoURL || "/default-avatar.png",
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData)); // Sync with local storage
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  // Login method
  const login = async (userData: User) => {
    try {
      await axios.post(`${baseUrl}/api/users`, userData);

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log("User logged in and saved.");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Context value
  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}