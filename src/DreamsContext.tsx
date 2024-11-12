import React, { useMemo, useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
}

type ContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DreamsContext = React.createContext<ContextType>({
  loader: false,
  setLoader: () => {},
})

export const DreamsProvider: React.FC<Props> = ({children}) => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      console.log('It is work');
    }, 3000)
  }, [])

  const value = useMemo(() => ({
    loader,
    setLoader,
  }), [loader, setLoader]);
  
  return (
    <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>
  )
}

