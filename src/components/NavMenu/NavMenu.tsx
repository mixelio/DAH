import {Avatar, Button, Divider, IconButton, Menu, MenuItem, Tooltip} from '@mui/material'
import {useContext, useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router-dom'
import userAvatar from '../../assets/images/user/user-avatar.jpeg';
import logo from "../../assets/images/main-logo.png";
import classNames from 'classnames';
import {DreamsContext} from '../../DreamsContext';
import {theme} from '../../utils/theme';

const pages = [
  {id: 1, name: 'Home', path: '/'},
  {id: 2, name: 'Dreams', path: '/dreams'}
]

const colorsPrimary = theme.palette.primary;

export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, setMainFormActive, activeIndex, setActiveIndex } =
    useContext(DreamsContext);
  const open = Boolean(anchorEl);
  const underLineRef = useRef<HTMLDivElement>(null);
  const currentMenuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleMenuClick = (index: number) => {
    setActiveIndex(index)
  }

  const handleSingInOpen = () => {
    setMainFormActive(true);
  }

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

  useEffect(() => {
    const activeItem = currentMenuItemRefs.current[activeIndex];
    if (activeItem && underLineRef.current) {
      const {offsetLeft, offsetWidth} = activeItem;
      underLineRef.current.style.left = `${offsetLeft}px`;
      underLineRef.current.style.width = `${offsetWidth}px`

    }
  }, [activeIndex])
  
  return (
    <nav className="navigation">
      <div
        className="navigation__active-marker"
        style={{
          position: "absolute",
          bottom: 0,
          height: "2px",
          background: `${colorsPrimary.main}`,
          transition: "left 0.3s ease, width 0.3s ease",
        }}
        ref={underLineRef}
      ></div>
      <div className="navigation__links">
        <NavLink
          to="/"
          className="navigation__logo"
          style={{ backgroundImage: `url(${logo})` }}
          onClick={() => handleMenuClick(0)}
        />
        {pages.map((page, index) => (
          <NavLink
            key={page.id}
            style={{ color: `${colorsPrimary.main}` }}
            to={page.path}
            className={getLinkClass}
            ref={(el) => (currentMenuItemRefs.current[index] = el)}
            onClick={() => handleMenuClick(index)}
          >
            {page.name}
          </NavLink>
        ))}
      </div>
      {currentUser ? (
        <div className="navigation__user-arera">
          <Tooltip title="">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                alt="Remy Sharp"
                src={userAvatar}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button onClick={handleSingInOpen} sx={{fontFamily: "inherit", color: `${colorsPrimary.main}`}}>
          Sing In
        </Button>
      )}
    </nav>
  );
}