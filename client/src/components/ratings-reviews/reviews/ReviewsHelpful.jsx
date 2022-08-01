/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  flexDisplay: {
    display: 'flex',
    gap: '15px',
    width: '40%',
    whiteSpace: 'nowrap',
    fontSize: 14,
    marginBottom: '20px',
  },
  greyedOut: {
    color: 'grey',
  },
};

export default function ReviewsHelpful({ helpfulness, reviewId }) {
  const [helpful, setHelpful] = useState(helpfulness);
  const [voted, setVoted] = useState(
    localStorage.getItem(`hasVoted-${reviewId}`) || false,
  );
  const [reported, setReported] = useState(
    localStorage.getItem(`hasReported-${reviewId}`) || false,
  );

  function handleClick(e) {
    e.preventDefault();

    const targetId = e.target.id;

    axios.put(
      `/reviews/${reviewId}/${targetId}`,
      {},
      {
        headers: {
          Authorization: process.env.GITKEY,
        },
      },
    )
      .then(() => {
        if (targetId === 'helpful') {
          setHelpful(helpful + 1);
          setVoted(true);
          localStorage.setItem(`hasVoted-${reviewId}`, true);
        }
        if (targetId === 'report') {
          setReported(true);
          localStorage.setItem(`hasReported-${reviewId}`, true);
        }
      })
      .catch((error) => { console.log('error: ', error); });
  }

  return (
    <div style={styles.flexDisplay}>
      Was this review helpful?
      {' '}
      {!voted ? (
        <div>
          <a href="#" onClick={handleClick} id="helpful">
            Yes
          </a>
          {`(${helpful})`}
        </div>
      ) : (
        <div style={styles.greyedOut}>
          Yes
          {`(${helpful})`}
        </div>
      )}
      {' '}
      |
      {' '}
      {!reported ? (
        <div>
          <a href="a" onClick={handleClick} id="report">
            Report
          </a>
        </div>
      ) : (
        <div style={styles.greyedOut}>
          Report
        </div>
      )}

    </div>
  );
}
