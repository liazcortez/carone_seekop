import React, { useState, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Quote from 'src/components/Quotes';
import {
  Grid,
  Box
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
  export default function SimpleBackdrop({loading, chart}) {
    const classes = useStyles();
    const [state, setState] = useState(true);

    useEffect(() => {
     if(chart && chart.length > 0 && chart !== undefined){
      setState(false)
     }else{
       setState(true)
     }
    }, [chart, loading])

    return (
      <div>
        <Backdrop className={classes.backdrop} open={state}>
          <Grid container>
            <Grid item md={12}>
              <Box display="flex" justifyContent="center">
                <Box p={1} >
                  <CircularProgress color="inherit" />
                </Box>
              </Box>
            </Grid>
            <Grid item md={12}>
              <Box display="flex" justifyContent="center">
                <Box p={1} >
                  <Quote/>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Backdrop>
      </div>
    );
  }
