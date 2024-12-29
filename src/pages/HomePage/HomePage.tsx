import { motion } from "motion/react";
import {useEffect, useState} from "react";
import {NearbyDream} from "../../components/NearbyDreams/NearbyDream";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {usersInit} from "../../features/users";

export const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {users} = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(usersInit());
    const timer = setTimeout(() => {
      setIsVisible(true);
      console.log('check users', users);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, users]);

  return (
    <>
      <motion.section
        className="first-screen"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <div className="first-screen__content">
            <motion.h1
              className="main-title first-screen__main-title"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              Dreams
            </motion.h1>
            <motion.h2
              className="first-screen__sub-title"
              initial={{ opacity: 0 }}
              animate={isVisible && { opacity: 1 }}
              transition={{ duration: 2 }}
            >
              Help <br />
              Others
            </motion.h2>
          </div>
        </div>
      </motion.section>
      <NearbyDream />
    </>
  );
};
