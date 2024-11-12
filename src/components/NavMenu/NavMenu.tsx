import {Avatar, Divider, IconButton, Menu, MenuItem, Tooltip} from '@mui/material'
import {useState} from 'react';
import {NavLink} from 'react-router-dom'
import userAvatar from '../../assets/images/user/user-avatar.jpeg';
import classNames from 'classnames';


export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getLinkClass = (
    { isActive }: { isActive: boolean },
    additionalClasses?: string,
  ) =>
    classNames('navigation__link', additionalClasses, {
      'is-active': isActive,
    });
  
  return (
    <nav
      className='navigation'
    >
      <div className='navigation__links'>
        <NavLink 
          to='/'
          className='navigation__logo'
        />
        <NavLink 
          to='/'
          className={getLinkClass}
        >
          Home
        </NavLink>
        <NavLink 
          to='/dreams'
          className={getLinkClass}
        >
          Dreams
        </NavLink>
      </div>
      <div className='navigation__user-arera'>
        <Tooltip title=''>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar alt='Remy Sharp' src={userAvatar} sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Tooltip>
        <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          Logout
        </MenuItem>
      </Menu>
      </div>
    </nav>
  )
}