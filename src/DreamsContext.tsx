import React, { useMemo, useState, useEffect } from 'react';
import {User} from './types/User';
import {getUsers} from './services/users';

type Props = {
  children: React.ReactNode;
}

type ContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
  currentUser: User | null;
  setCurrentUser: (value: User | null) => void;
  mainFormActive: boolean;
  setMainFormActive: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  users: User[];
  setUsers: (value: User[]) => void; 
};

// eslint-disable-next-line react-refresh/only-export-components
export const DreamsContext = React.createContext<ContextType>({
  loader: false,
  setLoader: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  mainFormActive: false,
  setMainFormActive: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  users: [],
  setUsers: () => {},
});

export const DreamsProvider: React.FC<Props> = ({children}) => {
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mainFormActive, setMainFormActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    setLoader(true);
    getUsers().then((res) => setUsers([...res]));
  }, [])

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser])

  const value = useMemo(() => ({
    loader,
    setLoader,
    currentUser,
    setCurrentUser,
    mainFormActive,
    setMainFormActive,
    activeIndex,
    setActiveIndex,
    users,
    setUsers,
  }), [loader, currentUser, mainFormActive, activeIndex, users]);
  
  return (
    <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>
  )
}

