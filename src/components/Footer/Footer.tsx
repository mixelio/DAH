import {NavLink} from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <NavLink 
            to='/'
            className='navigation__logo'
          />
        </div>
      </div>
    </footer>
  )
}