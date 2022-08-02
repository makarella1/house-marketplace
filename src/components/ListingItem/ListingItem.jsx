import { FaBath, FaBed } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import styles from './ListingItem.module.scss';

const ListingItem = ({ listing, id }) => {
  const location = listing.location.split(',')[0];

  return (
    <li className={styles.listing}>
      <Link
        className={styles.listingLink}
        to={`/categories/${listing.type}/${id}`}
      >
        <img
          className={styles.listingImg}
          src={listing.imageUrls[0]}
          alt={listing.name}
        />
        <div className={styles.info}>
          <p className={styles.location}>{location}</p>
          <p className={styles.name}>{listing.name}</p>
          <p className={styles.price}>
            {listing.offer
              ? `$${listing.discountedPrice}`
              : `$${listing.regularPrice}`}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className={styles.subInfo}>
            <FaBed className={styles.icon} size={20} />
            <p className={styles.subInfoText}>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </p>
            <FaBath className={styles.icon} size={20} />
            <p className={styles.subInfoText}>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ListingItem;
