import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import {
  Box,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';


const LoadingScreen = ({width}) => {

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
    >
      <Box width={width} style={{paddingTop: '180px'}}>
        <LinearProgress />
      </Box>
    </Box>
    
  );
};

export default LoadingScreen;
