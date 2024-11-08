import {NavLink} from "react-router-dom"

export const NavMenu = () => {
  
  return (
    <nav
      className="navigation"
    >
      <NavLink 
        to="/"
        className="navigation__link"
        style={({isActive}) => ({
          color: isActive ? "green" : "red",
          textDecoration: "none",
        })}
      >
        Home
      </NavLink>
      <NavLink 
        to="/dreams"
        className="navigation__link"

      >Dreams</NavLink>
    </nav>
  )
}