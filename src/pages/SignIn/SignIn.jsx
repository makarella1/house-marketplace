import { useState, useRef } from 'react';
import { useToast } from '../../hooks/useToast';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { Link, useNavigate } from 'react-router-dom';

import { BsArrowRightShort, BsFillPersonFill } from 'react-icons/bs';
import { AiFillEye } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import OAuth from '../../components/OAuth/OAuth';

import styles from './SignIn.module.scss';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const showToast = useToast();

  const { email, password } = formData;

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

      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        showToast('success', 'Welcome!');
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'Wrong Credentials!');
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Welcome Back!" />
      <form className={styles.form} onSubmit={submitHandler}>
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
        <div className={styles.forgotPassword}>
          <Link className={styles.forgotPassword} to="/forgot-password">
            Forgot Password
          </Link>
        </div>
        <div className={styles.actions}>
          <p className={styles.actionsHeader}>Sign In</p>
          <button className={styles.actionsBtn} type="submit">
            <BsArrowRightShort />
          </button>
        </div>
        <div className={styles.textCenter}>
          <Link className={styles.link} to="/sign-up">
            Sign Up Instead
          </Link>
        </div>

        <OAuth />
      </form>
    </PageContainer>
  );
};

export default SignIn;
