import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';

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
    <PageContainer>
      <PageHeader title="Contact Landlord" />

      <h3 className="text-2xl font-bold mb-10">Contact {landlord?.name}</h3>
      <label className="block mb-2 font-bold" htmlFor="message">
        Message
      </label>
      <textarea
        className="rounded-lg border border-success outline-none p-2 font-bold mb-2 max-w-2xl w-full"
        onChange={changeHandler}
        value={message}
        id="message"
      />
      <a
        href={`mailto:${landlord?.email}?subject=${searchParams.get(
          'listingName'
        )}&body=${message}`}
      >
        <button className="btn btn-primary block text-white">
          Send an Email
        </button>
      </a>
    </PageContainer>
  );
};
export default Contact;
