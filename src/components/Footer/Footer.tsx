import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import {NavLink} from "react-router-dom"
import FacebookIcon from '@mui/icons-material/FacebookTwoTone';
// import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const actions = [
  {id: 1, icon: <FacebookIcon />, name: 'facebook', path: 'https://facebook.com'},
  {id: 2, icon: <InstagramIcon />, name: 'instagram', path: 'https://instagram.com'}
]

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <NavLink 
            to='/'
            className='navigation__logo'
          />
          <div className="footer__navigation">
            <NavLink 
              to='/aboutus'
              className='footer__nav-link'
            >About Us</NavLink>
            <NavLink 
              to='/contacts'
              className='footer__nav-link'
            >Contacts</NavLink>
          </div>
            <SpeedDial
              ariaLabel="SpeedDial openIcon example"
              className="footer__speed-dial"
              icon={<SpeedDialIcon icon={<GroupsIcon />} openIcon={<CloseIcon />} />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  sx={{zIndex: 2}}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={() => window.open(action.path, '_blank')}
                />
              ))}
            </SpeedDial>
        </div>
      </div>
    </footer>
  )
}