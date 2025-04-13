import React, { useMemo, useState } from 'react';
import {User} from './types/User';
import {Dream} from './types/Dream';
import {CommentType} from './types/Comment';

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
  currentDream: Dream | null;
  setCurrentDream: (value: Dream | null) => void;
  mainFormActive: boolean;
  setMainFormActive: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  users: User[];
  setUsers: (value: User[]) => void;
  dreams: Dream[];
  setDreams: (value: Dream[]) => void;
  comments: CommentType[];
  setComments: (value: CommentType[]) => void;
  logginedUserId: string | null;
  setLogginedUserId: (value: string | null) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const DreamsContext = React.createContext<ContextType>({
  loader: false,
  setLoader: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  currentDream: null,
  setCurrentDream: () => {},
  mainFormActive: false,
  setMainFormActive: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  users: [],
  setUsers: () => {},
  dreams: [],
  setDreams: () => {},
  comments: [],
  setComments: () => {},
  logginedUserId: localStorage.getItem('currentUser'),
  setLogginedUserId: () => {}
});

export const DreamsProvider: React.FC<Props> = ({children}) => {
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentUser, setCurrentUser] = useState<Pick<User, "first_name" | "email" | "password"> | null>(null);
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [mainFormActive, setMainFormActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [logginedUserId, setLogginedUserId] = useState<string | null>(localStorage.getItem('currentUser'));


  const value = useMemo(() => ({
    loader,
    setLoader,
    currentUser,
    setCurrentUser,
    currentDream,
    setCurrentDream,
    mainFormActive,
    setMainFormActive,
    activeIndex,
    setActiveIndex,
    users,
    setUsers,
    dreams,
    setDreams,
    comments,
    setComments,
    logginedUserId,
    setLogginedUserId,
  }), [loader, currentUser, currentDream, mainFormActive, activeIndex, users, dreams, comments, logginedUserId]);
  
  return (
    <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>
  )
}

