import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import {
  collection,
  orderBy,
  startAfter,
  where,
  query,
  getDocs,
  limit,
} from 'firebase/firestore';

import { db } from '../../config/firebase.config';

import PageContainer from '../../components/UI/PageContainer/PageContainer';
import PageHeader from '../../components/UI/PageHeader/PageHeader';
import ListingItem from '../../components/ListingItem/ListingItem';
import Spinner from '../../components/UI/Spinner/Spinner';

const Offers = () => {
  const { categoryName } = useParams();
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp'),
          limit(10)
        );

        const querySnap = await getDocs(q);

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        showToast('error', "Couldn't fetch the data");
      }
    };

    fetchListings();
  }, [categoryName]);

  return (
    <PageContainer>
      <PageHeader title="Offers" />
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <ul>
          {listings.map((listing) => (
            <ListingItem
              listing={listing.data}
              id={listing.id}
              key={listing.id}
            />
          ))}
        </ul>
      ) : (
        <p>Found no places for {categoryName}</p>
      )}
    </PageContainer>
  );
};

export default Offers;
