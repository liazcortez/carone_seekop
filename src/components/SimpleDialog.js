import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import Dialog from '@material-ui/core/Dialog';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => handleListItemClick('no')} key={'no'} color="primary">
            Disagree
          </Button>
          <Button onClick={() => handleListItemClick('yes')} key={'yes'} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
       
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default SimpleDialog;
