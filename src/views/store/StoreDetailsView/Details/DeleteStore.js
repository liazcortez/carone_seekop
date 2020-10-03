import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';  
import useStore from 'src/hooks/useStore';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import SimpleDialog from 'src/components/SimpleDialog'

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
    Delete as DeleteIcon
  
  } from 'react-feather';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    },
    error: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: "#d0392e"
      }
    },
  }));
  
  const DeleteStore = ({ className, ...rest }) => {
    const classes = useStyles();

    const { getStore, deleteStore, getStores } = useStore();
    const route = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();  
    const [open, setOpen] = React.useState(false);

    const handleClose = async (value) => {
      setOpen(false);
      if(value === 'yes'){      
        deleteStore(route.id);
        getStores();
        enqueueSnackbar('Store deleted', {
          variant: 'error'
        });
        history.push("/app/management/stores");
      }
    };

    const handleDelete = () =>{
       setOpen(true)
    }
    useEffect(() => {
      getStore(route.id)
      
      // eslint-disable-next-line
    }, [])

    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <SimpleDialog open={open} onClose={handleClose} />

        <CardHeader title="Delete" />
        <Divider />
        <CardContent>
            <Box
              mt={2}
            >
                <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    className={classes.error}
                    >
                    Delete Store
                </Button>
            </Box>
        </CardContent>
      </Card>
    );
  };
  
  DeleteStore.propTypes = {
    className: PropTypes.string,
  };
  
  export default DeleteStore;
  