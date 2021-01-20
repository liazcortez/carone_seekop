import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, all } = props;
  const{ t } = useTranslation();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{all ? t("Modals.DeleteAll") : t("Modals.DeleteQuestion")}</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => handleListItemClick('no')} key={'no'} color="primary">
          {t("Buttons.Disagree")}
          </Button>
          <Button onClick={() => handleListItemClick('yes')} key={'yes'} color="primary" autoFocus>
          {t("Buttons.Agree")}
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
