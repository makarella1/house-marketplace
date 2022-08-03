import { useState, useRef } from 'react';
import { useToast } from '../../hooks/useToast';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

import { Link, useNavigate } from 'react-router-dom';

import { BsArrowRightShort, BsFillPersonFill, BsPenFill } from 'react-icons/bs';
import { AiFillEye } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import OAuth from '../../components/OAuth/OAuth';

import styles from './SignUp.module.scss';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const navigate = useNavigate();
  const showToast = useToast();

  const { email, password, name } = formData;

  const passwordVisibilityHandler = () => {
    setShowPassword((prevState) => !prevState);
  };

  const inputChangeHandler = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;

      formData.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');

      showToast('success', 'Welcome! Make yourself at home :)');
    } catch (error) {
      showToast('error', 'Something went wrong with the registration!');
    }
  };

  return (
    <>
      <PageHeader title="Welcome Back!" />
      <PageContainer>
        <form className={styles.form} onSubmit={submitHandler}>
          <div className={styles.formControl}>
            <BsPenFill className={styles.icon} size={20} />
            <input
              className={styles.formInput}
              type="text"
              name="name"
              value={name}
              placeholder="Name"
              onChange={inputChangeHandler}
            />
          </div>
          <div className={styles.formControl}>
            <BsFillPersonFill className={styles.icon} size={20} />
            <input
              className={styles.formInput}
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={inputChangeHandler}
            />
          </div>
          <div className={styles.formControl}>
            <RiLockPasswordFill className={styles.icon} size={20} />
            <input
              className={styles.formInput}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              placeholder="Password"
              onChange={inputChangeHandler}
            />
            <button
              className={styles.iconRight}
              onClick={passwordVisibilityHandler}
              type="button"
            >
              <AiFillEye size={20} />
            </button>
          </div>
          <div className={styles.actions}>
            <p className={styles.actionsHeader}>Sign Up</p>
            <button className={styles.actionsBtn} type="submit">
              <BsArrowRightShort />
            </button>
          </div>
          <div className={styles.textCenter}>
            <Link className={styles.link} to="/sign-in">
              Sign In Instead
            </Link>
          </div>

          <OAuth />
        </form>
      </PageContainer>
    </>
  );
};

export default SignUp;
