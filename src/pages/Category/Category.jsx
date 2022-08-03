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

const Category = () => {
  const { categoryName } = useParams();
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('type', '==', categoryName),
          orderBy('timestamp'),
          limit(10)
        );

        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

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

  const loadMoreHandler = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast('error', "Couldn't fetch the data");
    }
  };

  return (
    <PageContainer>
      <PageHeader title={`Places for ${categoryName}`} />
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <ul className="mb-10">
            {listings.map((listing) => (
              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={listing.id}
              />
            ))}
          </ul>
          {lastFetchedListing && (
            <button
              className="btn btn-info w-full btn-sm"
              onClick={loadMoreHandler}
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <p>Found no places for {categoryName}</p>
      )}
    </PageContainer>
  );
};

export default Category;
