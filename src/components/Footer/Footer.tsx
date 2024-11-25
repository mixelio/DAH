import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import {NavLink} from "react-router-dom"
import FacebookIcon from '@mui/icons-material/FacebookTwoTone';
// import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import {theme} from '../../utils/theme';
import {useContext, useEffect, useState} from "react";
import {DreamsContext} from "../../DreamsContext";
const colorsPrimary = theme.palette.primary;

const actions = [
  {id: 1, icon: <FacebookIcon />, name: 'facebook', path: 'https://facebook.com'},
  {id: 2, icon: <InstagramIcon />, name: 'instagram', path: 'https://instagram.com'}
]

export const Footer = () => {
  const {setActiveIndex} = useContext(DreamsContext);
  const [open, setOpen] = useState(false);

  // #region Function

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // #endregion

  useEffect(() => {
    if (open) {
      window.addEventListener('scroll', handleClose)
    } else {
      window.removeEventListener('scroll', handleClose)
    }
  }, [open])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <NavLink
            to="/"
            className="navigation__logo"
            onClick={() => setActiveIndex(0)}
          >
            Dreams are here...
          </NavLink>
          <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            className="footer__speed-dial"
            icon={
              <SpeedDialIcon icon={<GroupsIcon />} openIcon={<CloseIcon />} />
            }
            open={open}
            onTouchStart={() => setOpen(!open)}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
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