import {Avatar, Button, IconButton, Menu, MenuItem, Tooltip} from '@mui/material'
import {useContext, useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom'
import logo from "../../assets/images/main-logo.png";
import classNames from 'classnames';
import {DreamsContext} from '../../DreamsContext';
import {theme} from '../../utils/theme';
import {getUser} from '../../utils/getUser';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {userFavouritesInit} from '../../features/users';

const pages = [
  {id: 1, name: 'Home', path: '/'},
  {id: 2, name: 'Dreams', path: '/dreams'},
  {id: 3, name: 'About', path: '/aboutus'}
];

const colorsPrimary = theme.palette.primary;
const colorsText = theme.palette.text;

export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    setMainFormActive, 
    setActiveIndex } = useContext(DreamsContext);
  const {users, userFavouriteList} = useAppSelector(store => store.users);
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const userFromLocaleStorage = localStorage.getItem("currentUser");

  useEffect(() => {
    const featchFavoures = async () => {
      const access = localStorage.getItem("access");
      try {
        if(access) {
            await dispatch(userFavouritesInit(access));
          }
        } catch (error) {
          console.error('Error:', error);
      }
    }

    featchFavoures();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromLocaleStorage]);

  const loginedUser = userFromLocaleStorage
    ? getUser(+userFromLocaleStorage, users)
    : null;

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
  
  return (
    <nav className="navigation">
      <div className="navigation__links">
        <NavLink
          to="/"
          className="navigation__logo"
          onClick={() => handleMenuClick(0)}
        >
          <img className="navigation__logo-img" src={logo} alt="" />
        </NavLink>
        <div className="navigation__pages">
          {pages.map((page, index) => (
            <NavLink
              key={page.id}
              to={page.path}
              className={getLinkClass}
              onClick={() => handleMenuClick(index)}
            >
              {page.name}
            </NavLink>
          ))}
        </div>
      </div>
      {loginedUser ? (
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
              <Avatar alt="" src={loginedUser.photo_url}>
                {!loginedUser.photo && <AccountCircleIcon />}
              </Avatar>
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
                  width: "160px",
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
            <MenuItem onClick={() => navigate(`profile/${loginedUser.id}`)}>
              My Profile
            </MenuItem>

            <MenuItem
              className="navigation__favorite-link"
              onClick={() => navigate(`profile/${loginedUser.id}/favorites`)}
            >
              Favorite Dreams
              <div className="navigation__favorite-count">
                {userFavouriteList.length}
              </div>
            </MenuItem>

            <MenuItem>Help&Support</MenuItem>

            <MenuItem
              sx={{ color: `${colorsText.secondary}`, fontWeight: 300, marginTop: "10px" }}
              onClick={() => {
                localStorage.setItem("currentUser", "");
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                navigate("/");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <Button
          className="navigation__in-btn"
          variant="contained"
          onClick={handleSingInOpen}
          sx={{ fontFamily: "inherit", color: `${colorsPrimary.main}` }}
        >
          Sign In
        </Button>
      )}
    </nav>
  );
}