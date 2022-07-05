import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Reference to Collection
        const listingsRef = collection(db, 'listings');

        // Create a query
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));

        // Execute Query
        const querySnap = await getDocs(q);

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
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: '300px' }}
      >
        {listings.map(({ id, data }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            <div
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="swiperSlideDiv"
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                $
                {data.offer
                  ? data.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : data.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                {data.type === 'rent' && '/ month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )
  );
}

export default Slider;
