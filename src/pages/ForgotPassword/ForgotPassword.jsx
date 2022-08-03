import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { Link } from 'react-router-dom';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import { BsFillPersonFill, BsArrowRightShort } from 'react-icons/bs';

import styles from './ForgotPassword.module.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const showToast = useToast();

  const changePasswordHandler = async (event) => {
    event.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      showToast('success', 'Check your email!');
    } catch (error) {
      showToast('succes', "We didn't manage to change your password :(");
    }
  };

  const changeHandler = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <PageHeader title="Forgot Password" />{' '}
      <PageContainer>
        <form className={styles.form} onSubmit={changePasswordHandler}>
          <div className={styles.formControl}>
            <BsFillPersonFill className={styles.icon} size={20} />
            <input
              className={styles.formInput}
              type="email"
              placeholder="Email"
              onChange={changeHandler}
              value={email}
            />
          </div>

          <div className={styles.textRight}>
            <Link className={styles.link} to="/sign-in">
              Sign In
            </Link>
          </div>

          <div className={styles.actions}>
            <p className={styles.actionsHeader}>Send verification email</p>
            <button className={styles.actionsBtn} type="submit">
              <BsArrowRightShort />
            </button>
          </div>
        </form>
      </PageContainer>
    </>
  );
};

export default ForgotPassword;
