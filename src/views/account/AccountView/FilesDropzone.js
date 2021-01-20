import React, {
    useCallback
  } from 'react';
  import clsx from 'clsx';
  import { useDropzone } from 'react-dropzone';
  import PropTypes from 'prop-types';
  import {
    makeStyles,
    Avatar
  } from '@material-ui/core';
  import {
    Edit as EditIcon
  } from 'react-feather'

  const useStyles = makeStyles((theme) => ({
    root: {},
    dropZone: {
      padding: theme.spacing(2),
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      alignItems: 'center',
      '&:hover': {
         cursor: 'pointer'
      }
    },
    dragActive: {
      backgroundColor: theme.palette.action.active,
      opacity: 0.5
    },
    image: {
      width: 130
    },
    info: {
      marginTop: theme.spacing(1)
    },
    list: {
      maxHeight: 320
    },
    actions: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
      '& > * + *': {
        marginLeft: theme.spacing(2)
      }
    },
    avatar: {
      height: 125,
      width: 125
    },
    edit: {
      position: 'absolute', 
      bottom: 0, 
      right: 0,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.main,
      width: 25,
      height: 25,
    }
   
  }));
  
  const FilesDropzone = ({ className, setAttachment, image, ...rest }) => {
    const classes = useStyles();
  
    const handleDrop = useCallback((acceptedFiles) => {
      setAttachment(acceptedFiles[0])
    //eslint-disable-next-line
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleDrop,
      accept: 'image/jpeg, image/png'
    });
  
    return (
      <div
        className={clsx(classes.root, className)}
        {...rest}
      >
        <div
          className={clsx({
            [classes.dropZone]: true,
            [classes.dragActive]: isDragActive
          })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
        
          <div style={{position: 'relative'}}>
            <Avatar
              className={classes.avatar}
              src={image ? image : '/app/account'}
            />
            <Avatar className={classes.edit}>
                <EditIcon style={{width: 14}}/>
            </Avatar>
          </div>

           
        
        </div>
       
      </div>
    );
  };
  
  FilesDropzone.propTypes = {
    className: PropTypes.string
  };
  
  export default FilesDropzone;
  