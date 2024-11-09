
import './App.scss'
import {Outlet} from 'react-router-dom';
import {NavMenu} from './components/NavMenu/NavMenu';
import {SingUpInForm} from './components/SingUpInForm/SingUpInForm';


function App() {
  

  return (
    <>
      <NavMenu />
      <h1>Dreams are here!</h1>
      <Outlet />
      <SingUpInForm />
    </>
  )
}

export default App
