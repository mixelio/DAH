import {NavLink} from "react-router-dom"
// import {theme} from '../../utils/theme';
import {useContext} from "react";
import {DreamsContext} from "../../DreamsContext";
// const colorsPrimary = theme.palette.primary;

import logo from "../../assets/images/main-logo.png";

export const Footer = () => {
  const {setActiveIndex} = useContext(DreamsContext);

  // #region Function


  // #endregion

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <NavLink
            to="/"
            className="navigation__logo footer__logo"
            onClick={() => setActiveIndex(0)}
          >
            <img className="navigation__logo-img" src={logo} alt="" />
          </NavLink>
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}