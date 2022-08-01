/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Reviews from './reviews/index.jsx';
import Ratings from './ratings/index.jsx';
import getTotalRatings from '../../../utils/getTotalRatings';

const styles = {
  flexContainer: {
    display: 'flex',
    margin: '50px auto 50px auto',
    width: '70%',
    gap: '60px',
    alignItems: 'stretch',
    backgroundColor: '#EDEDE9',
    padding: '20px',
    flexWrap: 'wrap',
  },

  ratingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    fontSize: '20px',
  },

  reviewsContainer: {
    flex: 1,
  },
};

export default function RrBox({
  productId, setTotalRatings, setAvgRating, ratingsReviewsNode,
}) {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(2);
  const [sort, setSort] = useState('relevant');
  const [meta, setMeta] = useState();
  const [filterRatings, setFilterRatings] = useState();
  const [showModal, setShowModal] = useState(false);
  const [currRating, setRating] = useState({
    1: false, 2: false, 3: false, 4: false, 5: false,
  });

  localStorage.setItem('productId', productId);

  useEffect(() => {
    axios.get('/reviews', {
      headers: {
        Authorization: process.env.GITKEY,
      },
      params: {
        product_id: productId,
        count,
        sort,
      },
    })
      .then((res) => {
        const reviewsData = res.data.results;
        const ratingArray = Object.values(currRating);
        const mapped = ratingArray.flatMap((bool, index) => {
          if (bool) {
            return index + 1;
          }
          return [];
        });
        if (mapped.length === 0) {
          setReviews(reviewsData);
        } else {
          const ratingMatch = reviewsData.filter((r) => mapped.indexOf(r.rating) !== -1);
          setReviews(ratingMatch);
        }
      })
      .catch((err) => console.log('Error RrBox: ', err));
  }, [productId, sort, count, currRating, showModal]);

  useEffect(() => {
    axios.get('/reviews/meta', {
      headers: {
        Authorization: process.env.GITKEY,
      },
      params: {
        product_id: productId,
      },
    })
      .then((res) => {
        const metaData = res.data;
        setTotalRatings(getTotalRatings(metaData.ratings));
        const ratingArray = Object.values(currRating);
        const mapped = ratingArray.flatMap((bool, index) => {
          if (bool) {
            return index + 1;
          }
          return [];
        });
        if (mapped.length === 0) {
          setMeta(metaData);
          setFilterRatings();
        } else {
          const ratingsValues = Object.values(metaData.ratings);
          const newRatingsData = {};
          for (let i = 0; i < mapped.length; i += 1) {
            const key = mapped[i];
            newRatingsData[key] = ratingsValues[key - 1];
          }
          setFilterRatings(newRatingsData);
          setMeta(metaData);
        }
      })
      .catch((err) => console.log('Error getting meta data (RrBox): ', err));
  }, [productId, currRating, showModal]);

  return (
    <div className="RrBox-container" style={styles.flexContainer} ref={ratingsReviewsNode}>
      <div style={styles.ratingsContainer}>
        <div style={{ fontSize: '25px', fontWeight: 'bold' }}>
          Ratings & Reviews
        </div>
        <Ratings
          meta={meta}
          currRating={currRating}
          setRating={setRating}
          filterRatings={filterRatings}
          setAvgRating={(num) => { setAvgRating(num); }}
        />
      </div>
      <div style={styles.reviewsContainer}>
        <Reviews
          reviews={reviews}
          setSort={setSort}
          count={count}
          meta={meta}
          setCount={setCount}
          filterRatings={filterRatings}
          showModal={showModal}
          setShowModal={setShowModal}
          id={productId}
        />
      </div>
    </div>
  );
}
