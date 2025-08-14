import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";


interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  status: string;
  roles: string[];
  permissions: string[];
  activeTenant: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
}

// Define the shape of the authentication context
interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
  user: User | null;
  setUser: (newUser: User | null) => void;
}

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to hold the authentication token
  const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));
  
  // Function to set the authentication token
  const setToken = (newToken: string | null): void => {
    setToken_(newToken);
  };

  // State to hold the authenticated user
  const [user, setUser_] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));
  
  // Function to set the authenticated user
  const setUser = (newUser: User | null): void => {
    setUser_(newUser);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    (): AuthContextType => ({
      token,
      setToken,
      user,
      setUser,
    }),
    [token, user]
  );

  // Add interceptor to handle 401 responses
  // axios.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     if (error.response.status === 401) {
  //       console.log('interceptor : 401 error');
  //       setToken(null);
  //       setUser(null);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;