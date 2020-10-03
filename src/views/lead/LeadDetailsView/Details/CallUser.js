import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';  
import useMail from 'src/hooks/useMail';
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
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  const CallUser = ({ className, customer, user, ...rest }) => {
    const classes = useStyles();
    const [roomId, setRoomId] = useState(null);
    const { createMail } = useMail();

    const handleCallUser = () =>{
        createMail({
           email: customer.email, 
           subject: 'Se ha agendado una videollamada', 
           message: `Para ingresar a nuestra videollamda por favor ingresa al siguiente enlace: http://localhost:3000/videocalls/${roomId}`,
           lead: customer._id,
           template: 'videocall'
        });
        window.open(`/videocalls/${roomId}`);
    }

    useEffect(()=>{
          setRoomId(user._id + '-' + customer._id);
      //eslint-disable-next-line
    },[user, customer])
 
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Videocall" />
        <Divider />
        <CardContent>
          <Box mt={2}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              color="primary"
              startIcon={<CallIcon />}
              onClick={handleCallUser}
            >
              Videocall
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  CallUser.propTypes = {
    className: PropTypes.string,
  };
  
  export default CallUser;
  