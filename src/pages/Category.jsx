import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [noMoreListings, setNoMoreListings] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Reference to Collection
        const listingsRef = collection(db, 'listings');

        // Create a query
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // Execute Query
        const querySnap = await getDocs(q);

        // Run second query on the next 10 docs to determine if more listings remain
        // Only check if first query returns documents --> this prevents a toast error message from appearing
        if (querySnap.docs.length > 0) {
          const lastVisible = querySnap.docs[querySnap.docs.length - 1];
          setLastFetchedListing(lastVisible);

          const nextQ = query(
            listingsRef,
            where('type', '==', params.categoryName),
            orderBy('timestamp', 'desc'),
            limit(10),
            startAfter(lastVisible)
          );
          const nextQuerySnap = await getDocs(nextQ);
          setNoMoreListings(nextQuerySnap.empty);
        }

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, [params.categoryName]);

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Reference to Collection
      const listingsRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        limit(10),
        startAfter(lastFetchedListing)
      );

      // Execute Query
      const querySnap = await getDocs(q);

      // Run second query on the next 10 docs to determine if more listings remain
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const nextQ = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        limit(10),
        startAfter(lastVisible)
      );
      const nextQuerySnap = await getDocs(nextQ);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setNoMoreListings(nextQuerySnap.empty);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
      setLoading(false);
    }
  };

  //TODO: Implement fetch retrieval of rapidAPI
  // useEffect(() => {
  //   const fetchRealtyListings = async () => {
  //     const options = {
  //       method: 'GET',
  //       headers: {
  //         'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  //         'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com',
  //       },
  //     };

  //     const response = await fetch(
  //       'https://realty-in-us.p.rapidapi.com/properties/list-for-rent?state_code=NY&city=New%20York%20City&limit=200&offset=0&sort=relevance&price_min=50',
  //       options
  //     );
  //     const { listings } = await response.json();
  //     console.log(listings);
  //   };

  //   fetchRealtyListings();
  // }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Places for Rent'
            : 'Places for Sale'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  data={listing.data}
                  id={listing.id}
                  key={listing.id}
                  categoryName={params.categoryName}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {!noMoreListings && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
