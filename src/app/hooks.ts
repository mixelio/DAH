import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {useEffect} from 'react';
import {refreshAccess} from '../utils/refreshAccess';

// Use these hooks everywhere instead of useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useRefresh = (interval: number) => {
  useEffect(() => {
    console.log("refresh");
    const timer = setInterval(async () => {
      const newAccsessTocken = await refreshAccess();

      if (!newAccsessTocken) {
        // localStorage.clear();
      } else {
        localStorage.setItem("access", newAccsessTocken);
      }


    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
};