import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

import styles from './PageSwiper.module.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const PageSwiper = ({ images }) => {
  return (
    <Swiper
      className={styles.swiper}
      slidesPerView={1}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      autoplay={{
        delay: 2000,
      }}
    >
      {images.map((_, index) => {
        return (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${images[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className={styles.image}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
export default PageSwiper;
