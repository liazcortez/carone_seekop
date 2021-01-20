import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Spinner from 'src/components/Spinner';
import FilesDropzone from '../FilesDropzone';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CapitalizeNames } from 'src/utils/capitalize';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  primaryColor: {
    color: theme.palette.primary.main
  }
}));

const ProfileDetails = ({ className, edit, user, ...rest}) => {
  const classes = useStyles();
  const [attachments, setAttachment] = useState(null);
  const { updateProfile, loading } = useAuth();
  const { t } = useTranslation()

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
            edit ? (
            loading ? 
            (
            <div style={{padding: '25%'}}>
              <Spinner width={25}/>
            </div>
              ) : (
              <FilesDropzone 
              setAttachment={setAttachment}
              image={ user && user.image ? `${process.env.REACT_APP_URL_IMAGE_S3_URL}${user.image}` : '/app/account'}
            />
            )
            ):(
              <Avatar
              className={classes.avatar}
              src={user && user.image ? `${process.env.REACT_APP_URL_IMAGE_S3_URL}${user.image}` : '/app/account'}
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
            {t("Account.YourTier")}:
            {' '}
              <span className={classes.primaryColor} variant="body2">
                {user && user.role
                  ? ' ' + CapitalizeNames(user.role)
                  : ''}
              </span>
          </Typography>
          {
            edit ? (
            <CardActions>
              <Button
                fullWidth
                variant="text"
                onClick={removePhoto}
              >
                {t("Account.RemovePicture")}
              </Button>
            </CardActions>
            ): null
          }
          
        </Box>
      </CardContent>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default ProfileDetails;
