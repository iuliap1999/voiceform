import { apiClient } from '../misc/api';
import { PublicUser } from '../misc/types';
import { ReactNode, createContext, useEffect, useState } from "react";

interface Props {
  children: ReactNode
}

interface ContextProps {
  user: PublicUser | null,
  login: (x: string, y: string) => Promise<void>,
  fetchUserData: () => Promise<void>,
  logout: () => Promise<void>,
}

export const AuthContext = createContext <ContextProps> ({
  user: {cnp: "0", id: 0, role: "pacient", profile: {
    id: 1,
    firstName: "",
    lastName: "",
    address: "",
    birthDate: "",
    bloodType: "",
    gender: "",
    height: "",
    weight: "",
    comments: [],
  }},
  login: async () => {},
  fetchUserData: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({children}: Props) => {
  const [user, setUser] = useState <PublicUser | undefined | null> (undefined);

  
  useEffect(() => {
    fetchUserData();
  }, [])

  const fetchUserData = async () => {
    try {
      const rs = await apiClient.getUserData();
      setUser(rs);
    }
    catch(e) {
      console.error(e);
      setUser(null);
    }
  }

  const login = async (cnp: string, password: string) => {
    const rs = await apiClient.login({cnp, password}) as PublicUser;
    setUser(rs);
  }

  const logout = async () => {
    try{
      await apiClient.logout();
      setUser(null);
    }
    catch(e) {
      console.error(e);
    }
  }


  if (user === undefined) return;

  return (
    <AuthContext.Provider value = {{
      user,
      login,
      fetchUserData,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}