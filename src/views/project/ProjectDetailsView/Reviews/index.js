import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import ReviewCard from './ReviewCard';
import Spinner from 'src/components/Spinner';

const useStyles = makeStyles((theme) => ({
  root: {},
  review: {
    marginTop: theme.spacing(2)
  }
}));

const Reviews = ({
  className,
  reviews,
  ...rest
}) => {
  const classes = useStyles();
useEffect(() => {
  console.log(reviews);

}, [reviews])

  return (
    <div>
      {(reviews)?
      <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      {reviews.map((review) => (
        <ReviewCard
          className={classes.review}
          key={review.id}
          review={review}
        />
      ))}
    </div>
    :<Spinner width={25}/>}
    </div>
    
  );
};

Reviews.propTypes = {
  className: PropTypes.string,
  reviews: PropTypes.array
};

export default Reviews;
