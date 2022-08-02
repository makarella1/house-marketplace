import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import Spinner from '../../components/UI/Spinner/Spinner';

import styles from './CreateListing.module.scss';

const API_KEY = import.meta.env.VITE_API_KEY;

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
  const auth = getAuth();
  const navigate = useNavigate();

  const showToast = useToast();

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = form;

  const { currentUser } = getAuth();

  useEffect(() => {
    setForm({ ...form, userRef: currentUser.uid });
  }, [setForm]);

  const submitHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    let geolocation = {};
    let location = null;

    if (discountedPrice >= regularPrice) {
      showToast('error', 'Discounted price should be less than a regular one!');
      setIsLoading(false);
      return;
    }

    if (images.length > 6) {
      showToast('error', 'Max 6 images');
      setIsLoading(false);
      return;
    }

    if (geolocationEnabled) {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${address}&output=json`
      );

      const results = await response.json();

      geolocation.lat = results.data[0]?.latitude;
      geolocation.lng = results.data[0]?.longitude;

      location =
        results.data[0]?.length === 0 ? undefined : results.data[0]?.label;

      if (location === undefined || location.includes('undefined')) {
        showToast('error', 'Please enter a correct address');
        setIsLoading(false);
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    const storeImages = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImages(image))
    );

    const formCopy = {
      ...form,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formCopy.images;
    delete formCopy.address;
    location && (formCopy.location = location);
    !formCopy.offer && delete formCopy.discountedPrice;

    const docRef = await addDoc(collection(db, 'listings'), formCopy);
    setIsLoading(false);
    showToast('success', 'Listing saved!');
    navigate(`/categories/${formCopy.type}/${docRef.id}`);
  };

  const inputChangeHandler = (event) => {
    let boolean = null;

    if (event.target.value === 'true') {
      boolean = true;
    }

    if (event.target.value === 'false') {
      boolean = false;
    }

    if (event.target.files) {
      setForm((prevState) => ({
        ...prevState,
        images: event.target.files,
      }));
    }

    if (!event.target.files) {
      setForm((prevState) => ({
        ...prevState,
        [event.target.name]: boolean ?? event.target.value,
      }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="Create a Listing" />

      <form className={styles.form} onSubmit={submitHandler}>
        <label className={styles.label}>Sell / Rent</label>
        <div className={styles.flex}>
          <button
            className={type === 'sale' ? 'formBtnActive' : 'formBtn'}
            value="sale"
            name="type"
            onClick={inputChangeHandler}
            type="button"
          >
            Sell
          </button>
          <button
            className={type === 'rent' ? 'formBtnActive' : 'formBtn'}
            value="rent"
            name="type"
            type="button"
            onClick={inputChangeHandler}
          >
            Rent
          </button>
        </div>
        <label className={styles.label}>Name</label>
        <div>
          <input
            className={styles.formInput}
            type="text"
            name="name"
            value={name}
            onChange={inputChangeHandler}
            minLength="10"
            maxLength="52"
            required
          />
        </div>
        <div className={styles.flex}>
          <div className={styles.formInputContainer}>
            <label className={styles.label}>Bedrooms</label>
            <input
              className={styles.formInputSmall}
              type="number"
              name="bedrooms"
              value={bedrooms}
              onChange={inputChangeHandler}
              min="1"
              max="50"
              required
            />
          </div>

          <div className={styles.formInputContainer}>
            <label className={styles.label}>Bathrooms</label>
            <input
              className={styles.formInputSmall}
              type="number"
              name="bathrooms"
              value={bathrooms}
              onChange={inputChangeHandler}
              min="1"
              max="50"
              required
            />
          </div>
        </div>
        <label className={styles.label}>Parking Spot</label>
        <div className={styles.flex}>
          <button
            className={parking ? 'formBtnActive' : 'formBtn'}
            value={true}
            name="parking"
            onClick={inputChangeHandler}
            type="button"
          >
            Yes
          </button>
          <button
            className={
              !parking && parking !== null ? 'formBtnActive' : 'formBtn'
            }
            value={false}
            name="parking"
            onClick={inputChangeHandler}
            type="button"
          >
            No
          </button>
        </div>
        <label className={styles.label}>Furnished</label>
        <div className={styles.flex}>
          <button
            className={furnished ? 'formBtnActive' : 'formBtn'}
            value={true}
            name="furnished"
            onClick={inputChangeHandler}
            type="button"
          >
            Yes
          </button>
          <button
            className={
              !furnished && furnished !== null ? 'formBtnActive' : 'formBtn'
            }
            value={false}
            name="furnished"
            onClick={inputChangeHandler}
            type="button"
          >
            No
          </button>
        </div>
        <label className={styles.label}>Address</label>
        <textarea
          className={styles.textarea}
          name="address"
          value={address}
          onChange={inputChangeHandler}
          required
        />
        {!geolocationEnabled && (
          <div className={styles.flex}>
            <div className={styles.formInputContainer}>
              <label className={styles.label}>Latitude</label>
              <input
                className={styles.formInputSmall}
                type="number"
                name="latitude"
                value={latitude}
                onChange={inputChangeHandler}
              />
            </div>

            <div className={styles.formInputContainer}>
              <label className={styles.label}>Longitude</label>
              <input
                className={styles.formInputSmall}
                type="number"
                name="longitude"
                value={longitude}
                onChange={inputChangeHandler}
                required
              />
            </div>
          </div>
        )}
        <label className={styles.label}>Offer</label>
        <div className={styles.flex}>
          <button
            className={offer ? 'formBtnActive' : 'formBtn'}
            value={true}
            name="offer"
            onClick={inputChangeHandler}
            type="button"
          >
            Yes
          </button>
          <button
            className={!offer && offer !== null ? 'formBtnActive' : 'formBtn'}
            value={false}
            name="offer"
            onClick={inputChangeHandler}
            type="button"
          >
            No
          </button>
        </div>
        <label className={styles.label}>Regular Price</label>
        <input
          className={styles.formInputMedium}
          type="number"
          name="regularPrice"
          value={regularPrice}
          onChange={inputChangeHandler}
          min="50"
          max="750000000"
          required
        />
        {type === 'rent' && <span className={styles.text}> / Per Month</span>}
        {offer && (
          <>
            <label className={styles.label}>Discounted Price</label>
            <input
              className={styles.formInputMedium}
              type="number"
              name="discountedPrice"
              value={discountedPrice}
              onChange={inputChangeHandler}
              min="50"
              max="750000000"
              required
            />
            {type === 'rent' && (
              <span className={styles.text}> / Per Month</span>
            )}
          </>
        )}
        <label className={styles.label}>Images (6 max.)</label>{' '}
        <input
          className={styles.formFiles}
          type="file"
          onChange={inputChangeHandler}
          accept=".jpg, .png, .jpeg"
          required
          multiple
        />
        <button className={styles.submitBtn} type="submit">
          Create a Listing
        </button>
      </form>
    </PageContainer>
  );
};

export default CreateListing;
