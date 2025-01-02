import './App.scss'
import {Outlet} from 'react-router-dom';
import {SingUpInForm} from './components/SingUpInForm/SingUpInForm';
import {Header} from './components/Header/Header';
import {Footer} from './components/Footer/Footer';
import {useRefresh} from './app/hooks';


function App() {
  useRefresh(1000 * 60 * 1);
  
  return (
    <div className='wrapper'>
      <Header />
      <main className="main">
        <Outlet />
        <SingUpInForm />
      </main>
      <Footer />
    </div>
  )
}

export default App
