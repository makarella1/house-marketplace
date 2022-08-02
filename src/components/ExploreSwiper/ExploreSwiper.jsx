import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ExploreSwiper = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const docRef = collection(db, 'listings');
      const docSnap = await getDocs(docRef);

      let listings = [];
      docSnap.forEach((doc) => listings.push(doc.data()));

      setListings(listings);
    };

    fetchListings();
  }, []);

  return (
    <>
      <h3 className="text-xl font-bold mb-2">Recommended</h3>
      <Swiper
        className="mb-4"
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{ delay: 3000 }}
      >
        {listings?.map((listing, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing?.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-96 w-full mx-auto rounded-lg relative"
              >
                <div className="absolute bottom-10 left-10 flex flex-col">
                  <p className="badge badge-primary badge-lg p-6 font-black text-white text-lg mb-2">
                    {listing?.name}
                  </p>
                  <p className="badge badge-success badge-lg font-black p-6 text-white text-lg">
                    ${listing?.regularPrice ?? listing?.discountedPrice}{' '}
                    {listing?.type === 'rent' && '/ Per Month'}
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
