import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

import { FaShareAlt } from 'react-icons/fa';
import ListingMap from '../../components/ListingMap/ListingMap';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import Spinner from '../../components/UI/Spinner/Spinner';
import LinkAlert from '../../components/UI/LinkAlert/LinkAlert';
import PageSwiper from '../../components/PageSwiper/PageSwiper';

import styles from './ListingPage.module.scss';

const ListingPage = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const auth = getAuth();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);

      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setIsLoading(false);
      } else {
        setIsLoading(false);
        navigate('/');
        showToast('error', 'Found no listing with such an ID');
      }
    };

    fetchListing();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const copyLinkHandler = () => {
    setIsLinkCopied(true);
    navigator.clipboard.writeText(window.location.href);

    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  return (
    <>
      <PageHeader className={styles.header} title={`${listing?.name}`}>
        <div>
          <button className={styles.shareBtn} onClick={copyLinkHandler}>
            <FaShareAlt size={20} />
          </button>
        </div>
      </PageHeader>
      <PageContainer>
        {listing && listing.imageUrls.length > 0 && (
          <PageSwiper images={listing.imageUrls} />
        )}
        {isLinkCopied && <LinkAlert />}
        <p className={styles.price}>
          {listing?.offer
            ? `$${listing?.discountedPrice}`
            : `$${listing?.regularPrice}`}
        </p>
        <p className={styles.location}>{listing?.location}</p>
        <div className={styles.badgesContainer}>
          <div className={styles.typeBadge}>
            {listing?.type === 'sale' ? 'Sale' : 'Rent'}
          </div>
          {listing?.offer && (
            <div className={styles.priceBadge}>
              ${listing?.regularPrice - listing?.discountedPrice} Discount
            </div>
          )}
        </div>
        <ul>
          <li className={styles.listItem}>
            {listing?.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li className={styles.listItem}>
            {listing?.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          {listing?.parking && <li className={styles.listItem}>Parking</li>}
          {listing?.furnished && <li className={styles.listItem}>Furnished</li>}
        </ul>
        <p className={styles.location}>Location</p>
        <ListingMap
          lat={listing?.geolocation.lat}
          lng={listing?.geolocation.lng}
          location={listing?.location}
        />
        {auth.currentUser?.uid !== listing?.userRef && (
          <Link
            className={styles.contactBtn}
            to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
          >
            Contact Landlord
          </Link>
        )}
      </PageContainer>
    </>
  );
};

export default ListingPage;
