import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

import { FaShareAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import ListingMap from '../../components/ListingMap/ListingMap';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import PageContainer from '../../components/UI/PageContainer/PageContainer';
import Spinner from '../../components/UI/Spinner/Spinner';
import LinkAlert from '../../components/UI/LinkAlert/LinkAlert';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
    <PageContainer>
      <PageHeader
        className="flex items-center justify-between"
        title={`${listing?.name}`}
      >
        <div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl bg-white cursor-pointer ml-10"
            onClick={copyLinkHandler}
          >
            <FaShareAlt size={20} />
          </button>
        </div>
      </PageHeader>
      <Swiper
        className="mb-4"
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 2000,
        }}
      >
        {listing?.imageUrls.map((_, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing?.imageUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-96 w-full mx-auto rounded-lg"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      {isLinkCopied && <LinkAlert />}
      <p className="text-success font-bold text-2xl">
        {listing?.offer
          ? `$${listing?.discountedPrice}`
          : `$${listing?.regularPrice}`}
      </p>
      <p className="font-bold text-lg">{listing?.location}</p>
      <div className="mt-2 flex items-center mb-4">
        <div className="badge badge-warning badge-lg font-bold mr-2">
          {listing?.type === 'sale' ? 'Sale' : 'Rent'}
        </div>
        {listing?.offer && (
          <div className="badge badge-success badge-lg font-bold mr-2">
            ${listing?.regularPrice - listing?.discountedPrice} Discount
          </div>
        )}
      </div>
      <ul>
        <li className="font-bold">
          {listing?.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
        </li>
        <li className="font-bold">
          {listing?.bathrooms > 1
            ? `${listing.bathrooms} Bathrooms`
            : '1 Bathroom'}
        </li>
        {listing?.parking && <li className="font-bold">Parking</li>}
        {listing?.furnished && <li className="font-bold">Furnished</li>}
      </ul>
      <p className="my-4 text-xl font-bold">Location</p>
      <ListingMap
        lat={listing?.geolocation.lat}
        lng={listing?.geolocation.lng}
        location={listing?.location}
      />
      {auth.currentUser?.uid !== listing?.userRef && (
        <Link
          className="w-full btn btn-primary text-white"
          to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
        >
          Contact Landlord
        </Link>
      )}
    </PageContainer>
  );
};

export default ListingPage;
