import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

const AuthGuard = ({ children }) => {

  const [loadedUser, setLoadedUser] = useState(false);
  const { loadUser } = useAuth();

  if (!localStorage.getItem('token')) {

    return <Redirect to="/login" />;
  }else{
    if(!loadedUser){
      loadUser();
      setLoadedUser(true)
    }
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
