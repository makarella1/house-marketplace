import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';

import styles from './Contact.module.scss';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useToast();

  const { landlordId } = useParams();

  useEffect(() => {
    const fetchLandlord = async () => {
      const docRef = doc(db, 'users', landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        showToast('error', 'Could not find a landlord with such an ID');
      }
    };

    fetchLandlord();
  }, [landlordId]);

  const changeHandler = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <PageHeader title="Contact Landlord" />
      <PageContainer>
        <h3 className={styles.title}>Contact {landlord?.name}</h3>
        <label className={styles.label} htmlFor="message">
          Message
        </label>
        <textarea
          className={styles.textarea}
          onChange={changeHandler}
          value={message}
          id="message"
        />
        <a
          href={`mailto:${landlord?.email}?subject=${searchParams.get(
            'listingName'
          )}&body=${message}`}
        >
          <button className={styles.sendBtn}>Send an Email</button>
        </a>
      </PageContainer>
    </>
  );
};
export default Contact;
