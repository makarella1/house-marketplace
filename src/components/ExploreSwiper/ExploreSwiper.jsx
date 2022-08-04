import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import styles from './ExploreSwiper.module.scss';

const ExploreSwiper = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const docRef = collection(db, 'listings');
      const docSnap = await getDocs(docRef);

      let listings = [];
      docSnap.forEach((doc) => listings.push({ id: doc.id, data: doc.data() }));

      setListings(listings);
    };

    fetchListings();
  }, []);

  const navigateHandler = (args) => {
    const [type, id] = args;

    navigate(`/categories/${type}/${id}`);
  };

  return (
    <>
      <h3 className={styles.title}>Recommended</h3>
      <Swiper
        className={styles.swiper}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{ delay: 3000 }}
      >
        {listings?.map(({ data, id }, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${data?.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className={styles.image}
                onClick={navigateHandler.bind(null, [data?.type, id])}
              >
                <div className={styles.badgeContainer}>
                  <p className={styles.badgeName}>{data?.name}</p>
                  <p className={styles.badgePrice}>
                    ${data?.regularPrice ?? data?.discountedPrice}{' '}
                    {data?.type === 'rent' && '/ Per Month'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default ExploreSwiper;
