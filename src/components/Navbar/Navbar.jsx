import { useNavigate, useLocation } from 'react-router-dom';

import { MdOutlineLocalOffer, MdOutlineExplore } from 'react-icons/md';
import { BsPerson } from 'react-icons/bs';

import styles from './Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const matchPath = (path) => {
    if (location.pathname === path) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <footer className="btm-nav drop-shadow-2xl">
      <button
        className={`${matchPath('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <BsPerson size={24} />
        <span className="btm-nav-label">Profile</span>
      </button>
      <button
        className={`${matchPath('/offers') ? 'active' : ''}`}
        onClick={() => navigate('/offers')}
      >
        <MdOutlineLocalOffer size={24} />
        <span className="btm-nav-label">Offer</span>
      </button>
      <button
        className={`${matchPath('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <MdOutlineExplore size={24} />
        <span className="btm-nav-label">Explore</span>
      </button>
    </footer>
  );
};

export default Navbar;
