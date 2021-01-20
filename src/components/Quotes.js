import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {},
  quote: {
  },
}));

const Quote = ({...rest}) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);

    const Quotes = [
        t('Quotes.Q1'),
        t('Quotes.Q2'),
        t('Quotes.Q3'),
        t('Quotes.Q4'),
        t('Quotes.Q5'),
        t('Quotes.Q6'),
        t('Quotes.Q7'),
        t('Quotes.Q8'),
        t('Quotes.Q9'),
        t('Quotes.Q10'),
    ]

    useEffect(() => {
        setIndex(Math.floor(Math.random() * 10))
    }, [])

    return (
        <Typography variant='caption' className={classes.quote}>
        {Quotes[index]}
        </Typography>
    );
};

Quote.propTypes = {
  className: PropTypes.string,
};

export default Quote;
