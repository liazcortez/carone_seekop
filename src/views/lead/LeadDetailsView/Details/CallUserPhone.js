import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';  
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
  } from '@material-ui/core';

  import {
    Phone as CallIcon
  } from 'react-feather';
import useActivity from 'src/hooks/useActivity';
import useAuth from 'src/hooks/useAuth';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  const CallUser = ({ className, customer, user, ...rest }) => {
    const classes = useStyles();
    const { createActivity } = useActivity();

    useEffect(()=>{
      //eslint-disable-next-line
    },[])
 
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Call User" />
        <Divider />
        <CardContent>
          <Box mt={2}>
              <a href={`tel:${customer.phone}`} style={{textDecoration: 'none'}}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              color="primary"
              startIcon={<CallIcon />}
              onClick={(e)=>{
                const crearActividad = async(activity) =>{
                  await createActivity(activity)
                }

                crearActividad({
                  description: `${user.name} has called ${customer.name}`,
                  action: 'call',
                  lead: customer._id
                })
              }}
            >
              Call User
            </Button>
            </a>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  CallUser.propTypes = {
    className: PropTypes.string,
  };
  
  export default CallUser;
  