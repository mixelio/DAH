import { motion } from "motion/react";
import {useEffect, useState} from "react";

export const HomePage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);
  return (
    <motion.section
      className="first-screen"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container">
        <motion.h1
          className="main-title first-screen__main-title"
          initial={{ opacity: 0, x: "50%", y: "-50%" }}
          animate={isVisible ? { opacity: 1, x: "-50%", y: "-50%" } : {}}
          transition={{ duration: 1 }}
        >
          Dreams are here...
        </motion.h1>
      </div>
    </motion.section>
  );
};
