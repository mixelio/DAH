import React, { useMemo, useState, useEffect } from 'react';
import {User} from './types/User';

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
});

export const DreamsProvider: React.FC<Props> = ({children}) => {
  const [loader, setLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mainFormActive, setMainFormActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {

  }, [])

  const value = useMemo(() => ({
    loader,
    setLoader,
    currentUser,
    setCurrentUser,
    mainFormActive,
    setMainFormActive,
    activeIndex,
    setActiveIndex
  }), [loader, currentUser, mainFormActive, activeIndex]);
  
  return (
    <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>
  )
}

