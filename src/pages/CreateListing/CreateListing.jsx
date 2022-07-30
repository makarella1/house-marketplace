import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

import Spinner from '../../components/UI/Spinner/Spinner';

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnables] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const { currentUser } = getAuth();

  useEffect(() => {
    setForm({ ...form, userRef: currentUser.uid });
  }, [setForm]);

  if (isLoading) {
    return <Spinner />;
  }
};

export default CreateListing;
