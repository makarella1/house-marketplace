import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  where,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import { AiFillHome } from 'react-icons/ai';
import { BsArrowRightShort } from 'react-icons/bs';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import ListingItem from '../../components/ListingItem/ListingItem';

import styles from './Profile.module.scss';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [userListings, setUserListings] = useState([]);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const [changeProfile, setChangeProfile] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      const docsRef = collection(db, 'listings');
      const q = query(
        docsRef,
        where(
          'userRef',
          '==',
          auth.currentUser.uid,
          orderBy('timestamp', 'desc')
        )
      );

      const listingsSnap = await getDocs(q);

      let listings = [];
      listingsSnap.forEach((listing) =>
        listings.push({ id: listing.id, data: listing.data() })
      );
      setUserListings(listings);
    };

    fetchListings();
  }, []);

  const { name, email } = formData;

  const signOutHandler = async () => {
    try {
      auth.signOut();
      navigate('/');
      showToast('success', "You've successfully signed out!");
    } catch (error) {
      showToast('error', "We couldn't sign you out. Try again");
    }
  };

  const changeProfileHandler = async () => {
    try {
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });

        showToast('success', "You've successfully changed your name!");
      }
    } catch (error) {
      showToast('error', "We couldn't change your name! Try again.");
    }
  };

  const inputChangeHandler = (event) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const deleteHandler = async (listingId) => {
    if (window.confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'listings', listingId));

      const newListings = userListings.filter(
        (listing) => listing.id !== listingId
      );

      setUserListings(newListings);

      showToast('success', 'Listing was deleted!');
    }
  };

  const editHandler = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  return (
    <>
      <PageHeader title="My Profile" className={styles.header}>
        <button className={styles.logOutBtn} onClick={signOutHandler}>
          Log Out
        </button>
      </PageHeader>
      <PageContainer>
        <div className={styles.info}>
          <p className={styles.details}>Profile Details</p>
          <button
            className={styles.changeBtn}
            onClick={() => {
              changeProfile && changeProfileHandler();
              setChangeProfile((prevState) => !prevState);
            }}
          >
            {changeProfile ? 'Done' : 'Change Name'}
          </button>
        </div>
        <form className={styles.form}>
          <div className={styles.formControl}>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              className={
                changeProfile
                  ? `input ${styles.changeableText}`
                  : `input ${styles.unchangeableText}`
              }
              type="text"
              name="name"
              value={name}
              onChange={inputChangeHandler}
            />
          </div>
          <div className={styles.formControl}>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input className={styles.input} type="text" defaultValue={email} />
          </div>
        </form>

        <Link className={styles.createBtn} to="/create-listing">
          <AiFillHome size={20} />
          <p className="font-bold">Rent or sell your home!</p>
          <BsArrowRightShort size={20} />
        </Link>

        {userListings.length > 0 && (
          <>
            <p className={styles.listingsHeader}>Your Listings</p>
            {userListings.map((listing) => (
              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={listing.id}
                onDelete={deleteHandler}
                onEdit={editHandler}
              />
            ))}
          </>
        )}
      </PageContainer>
    </>
  );
};

export default Profile;
