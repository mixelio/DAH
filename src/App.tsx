
import './App.scss'
import {Outlet} from 'react-router-dom';
import {NavMenu} from './components/NavMenu/NavMenu';


function App() {
  

  return (
    <>
      <NavMenu />
      <h1>Dreams are here!</h1>
      <Outlet />
    </>
  )
}

export default App
