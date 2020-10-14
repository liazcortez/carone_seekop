import React from 'react';
import { makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import CTA from './CTA';
import FAQS from './FAQS';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {}
}));

const HomeView = () => {
  const classes = useStyles();

  if(!localStorage.getItem('token')){
  return (
    <Page
      className={classes.root}
      title="Home"
    >
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <FAQS />
    </Page>
  );}else{
    return <Redirect to="/app/management/leads" />;
  }
};

export default HomeView;
