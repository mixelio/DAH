import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {useEffect} from 'react';
import {refreshAccess} from '../utils/refreshAccess';
import {useNavigate} from 'react-router-dom';

// Use these hooks everywhere instead of useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useRefresh = (interval: number) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(async () => {

      try{
        const newAccessTocken = await refreshAccess();
        console.log("start refresh", newAccessTocken)

        if (!newAccessTocken) {
          localStorage.setItem("currentUser", "");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/");
        } else {
          localStorage.setItem("access", newAccessTocken);
          console.log("refresh");
        }
      } catch (e) {
        console.error(e)
      }

    }, interval);

    return () => clearInterval(timer);
  }, [interval, navigate]);
};