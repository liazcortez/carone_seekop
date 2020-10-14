import React, {
    useState,
    useCallback
  } from 'react';
  import clsx from 'clsx';
  import { useDropzone } from 'react-dropzone';
  import PerfectScrollbar from 'react-perfect-scrollbar';
  import PropTypes from 'prop-types';
  import {
    Box,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    makeStyles,
    Avatar
  } from '@material-ui/core';
  import FileCopyIcon from '@material-ui/icons/FileCopy';
  import bytesToSize from 'src/utils/bytesToSize';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    dropZone: {
      // border: `1px dashed ${theme.palette.divider}`,
      // padding: theme.spacing(6),
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        opacity: 0.5,
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
    }
  }));
  
  const FilesDropzone = ({ className, setAttachment, image, ...rest }) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
  
    const handleDrop = useCallback((acceptedFiles) => {
      setFiles(acceptedFiles);
      setAttachment(acceptedFiles[0])
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleDrop
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
            <Avatar
              className={classes.avatar}
              src={image ? image : '/app/account'}
            />
            {/* <img
            style={{height: 100}}
              alt="Select file"
              className={classes.image}
              src={image}
            /> */}
        </div>
        {files.length > 0 && (
          <>
            {/* <PerfectScrollbar options={{ suppressScrollX: true }}>
              <List className={classes.list}>
                {files.map((file, i) => (
                  <ListItem
                    divider={i < files.length - 1}
                    key={i}
                  >
                    <ListItemIcon>
                      <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{ variant: 'h5' }}
                      secondary={bytesToSize(file.size)}
                    />
                  </ListItem>
                ))}
              </List>
            </PerfectScrollbar> */}
          </>
        )}
      </div>
    );
  };
  
  FilesDropzone.propTypes = {
    className: PropTypes.string
  };
  
  export default FilesDropzone;
  