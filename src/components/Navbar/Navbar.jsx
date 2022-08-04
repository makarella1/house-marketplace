import { memo } from 'react';
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
    <nav className={styles.nav}>
      <button
        className={`${matchPath('/profile') ? `${styles.active}` : ''}`}
        onClick={() => navigate('/profile')}
      >
        <BsPerson size={24} />
        <span className={styles.label}>Profile</span>
      </button>
      <button
        className={`${matchPath('/offers') ? `${styles.active}` : ''}`}
        onClick={() => navigate('/offers')}
      >
        <MdOutlineLocalOffer size={24} />
        <span className={styles.label}>Offers</span>
      </button>
      <button
        className={`${matchPath('/') ? `${styles.active}` : ''}`}
        onClick={() => navigate('/')}
      >
        <MdOutlineExplore size={24} />
        <span className={styles.label}>Explore</span>
      </button>
    </nav>
  );
};

export default memo(Navbar);
