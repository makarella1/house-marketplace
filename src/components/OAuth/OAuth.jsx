import styles from './OAuth.module.scss';

import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import { FcGoogle } from 'react-icons/fc';

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const googleAuthHandler = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');

      showToast('success', "You've successfully authorized with Google!");
    } catch (error) {
      showToast('error', "Couldn't authorize with Google :(");
    }
  };

  return (
    <div className={styles.oauth}>
      <div className={styles.googleAuth}>
        <p className={styles.authTitle}>
          Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with
        </p>
        <button className={styles.authBtn} onClick={googleAuthHandler}>
          <FcGoogle size={30} />
        </button>
      </div>
    </div>
  );
};

export default OAuth;
