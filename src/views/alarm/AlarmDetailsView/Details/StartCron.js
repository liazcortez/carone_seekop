import React, {  useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';  
import useLead from 'src/hooks/useLead';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
  } from '@material-ui/core';
  import {
    Flag as CronIcon
  } from 'react-feather';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  
  const StartCron = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { startCron } = useLead();
    const [started, setStarted] = useState(true)
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Cron" />
        <Divider />
        <CardContent>
            <Button
                variant="contained"
                type="submit"
                size="large"
                fullWidth
                style={started ? {backgroundColor: '#8a85ff', color: 'white'} : {backgroundColor: '#f44336', color: 'white'}}
                startIcon={<CronIcon />}
                onClick={(e)=>{
                    startCron(started);
                    if(started){
                      enqueueSnackbar('Cron has successfully started', {
                        variant: 'success'
                      });
                    }else{
                      enqueueSnackbar('Cron has been stopped', {
                        variant: 'error'
                      });
                    }
                    
                      setStarted(!started)

                }}
            >
                    {!started ? 'Stop Cron': 'Start Cron'}
            </Button>
        </CardContent>
      </Card>
    );
  };
  
  StartCron.propTypes = {
    className: PropTypes.string,
  };
  
  export default StartCron;
  