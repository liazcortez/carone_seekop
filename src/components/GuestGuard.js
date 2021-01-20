import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const GuestGuard = ({ children }) => {

  const { loadUser  } = useAuth();
  const [loadedUser, setLoadedUser] = useState(false);


  if (localStorage.getItem('token')) {
    if(!loadedUser){
      loadUser();
      setLoadedUser(true)
    }
    return <Redirect to="/app/management/omsLeads" />;
  }

  return (
    <>
      {children}
    </>
  );
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
