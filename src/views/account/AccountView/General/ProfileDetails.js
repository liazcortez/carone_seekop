import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Spinner from 'src/components/Spinner';
import FilesDropzone from '../FilesDropzone';
import useAuth from 'src/hooks/useAuth';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  }
}));

const ProfileDetails = ({ className, user, ...rest}) => {
  const classes = useStyles();
  const [attachments, setAttachment] = useState(null);
  const { updateProfile, loading } = useAuth();

  const removePhoto = async() =>{
    await updateProfile({image: ''}, 'info')
  }
  
  useEffect(()=>{
    if(attachments){
      updateProfile(attachments, 'photo');
    }
    //eslint-disable-next-line
  },[attachments])
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          {
            loading ? 
            (
            <div style={{padding: '25%'}}>
              <Spinner width={25}/>
            </div>
              ) : (
              <FilesDropzone 
              setAttachment={setAttachment}
              image={ user && user.image ? `https://automotive-api.s3.us-east-2.amazonaws.com/${user.image}` : '/app/account'}
            />
            )
          }
            
          <Typography
            className={classes.name}
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body1"
          >
            Your tier:
            {' '}
            <Link
              component={RouterLink}
              to="/pricing"
            >
              {user.role ? user.role : ''}
            </Link>
          </Typography>
          <CardActions>
            <Button
              fullWidth
              variant="text"
              onClick={removePhoto}
            >
              Remove picture
            </Button>
          </CardActions>
        </Box>
      </CardContent>
{/* 
      {rest.removeimagebutton ? (<CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Change Picture
        </Button>
      </CardActions>) : ''} */}
      
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default ProfileDetails;
