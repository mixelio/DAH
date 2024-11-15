import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import logo from "../../assets/images/main-logo.png";
import {NavLink} from "react-router-dom"
import FacebookIcon from '@mui/icons-material/FacebookTwoTone';
// import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import {theme} from '../../utils/theme';
import {useContext} from "react";
import {DreamsContext} from "../../DreamsContext";
const colorsPrimary = theme.palette.primary;

const actions = [
  {id: 1, icon: <FacebookIcon />, name: 'facebook', path: 'https://facebook.com'},
  {id: 2, icon: <InstagramIcon />, name: 'instagram', path: 'https://instagram.com'}
]

export const Footer = () => {
  const {setActiveIndex} = useContext(DreamsContext)
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <NavLink
            to="/"
            className="navigation__logo"
            style={{ backgroundImage: `url(${logo})` }}
            onClick={() => setActiveIndex(0)}
          />
          <div className="footer__navigation">
            <NavLink
              to="/aboutus"
              className="footer__nav-link"
              onClick={() => setActiveIndex(0)}
            >
              About_Us
            </NavLink>
            <NavLink
              to="/contacts"
              className="footer__nav-link"
              onClick={() => setActiveIndex(0)}
            >
              Contacts
            </NavLink>
          </div>
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            className="footer__speed-dial"
            icon={
              <SpeedDialIcon icon={<GroupsIcon />} openIcon={<CloseIcon />} />
            }
          >
            {actions.map((action, index) => (
              <SpeedDialAction
                key={action.id || index}
                sx={{ zIndex: 2, color: `${colorsPrimary.light}` }}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => window.open(action.path, "_blank")}
              />
            ))}
          </SpeedDial>
        </div>
      </div>
    </footer>
  );
}