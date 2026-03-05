import { NavLink, Outlet } from 'react-router';
import { Paths } from '../routes/paths';
import '../styles/style.css';
import { removeSession } from '../auth/auth.utils';

const LayoutNeedy = () => {

  return (
    <div className='layout-container'>
      <header>
        <nav>
          <NavLink to={{ pathname: Paths.homeNeedy }}>Home</NavLink>
          
        </nav>
        <button id='logout-btn' onClick={() => removeSession()}>Logout</button>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>© 2025 React Course</footer>
    </div>
  );
};

export default LayoutNeedy;
