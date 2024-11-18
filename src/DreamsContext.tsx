import React, { useMemo, useState, useEffect } from 'react';
import {User} from './types/User';
import {getUsers} from './services/users';
import {Dream} from './types/Dream';
import {getDreams} from './services/dreams';

type Props = {
  children: React.ReactNode;
}

type ContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
  currentUser: Pick<User, "first_name" | "email" | "password"> | null;
  setCurrentUser: (
    value: Pick<User, "first_name" | "email" | "password"> | null
  ) => void;
  mainFormActive: boolean;
  setMainFormActive: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  users: User[];
  setUsers: (value: User[]) => void;
  dreams: Dream[];
  setDreams: (value: Dream[]) => void;
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
  dreams: [],
  setDreams: () => {}
});

export const DreamsProvider: React.FC<Props> = ({children}) => {
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [currentUser, setCurrentUser] = useState<Pick<User, "first_name" | "email" | "password"> | null>(null);
  const [mainFormActive, setMainFormActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    setLoader(true);
    getUsers().then((res) => setUsers([...res]));
    getDreams().then((res) => setDreams([...res]));
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
    dreams,
    setDreams,
  }), [loader, currentUser, mainFormActive, activeIndex, users, dreams]);
  
  return (
    <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>
  )
}

