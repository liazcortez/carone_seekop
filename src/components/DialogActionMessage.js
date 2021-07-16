import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuList,
  MenuItem,
  ListItemAvatar,
  makeStyles,
  Avatar,
  Divider,
  Card,
  Button,
  Box,
  FormHelperText,
  Typography,
  CardContent,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import { Formik } from 'formik';
import clsx from 'clsx';
import _ from 'lodash';
import {
  Info as InfoIcon,
  FileText as DocumentationIcon,
  Phone as CallingIcon,
  Mail as MailingIcon
} from 'react-feather';
import { blue, red, green, orange } from '@material-ui/core/colors';
import DialogTitle from '@material-ui/core/DialogTitle';

import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  mail: {
    backgroundColor: orange[100],
    color: orange[600]
  },
  call: {
    backgroundColor: green[100],
    color: green[600]
  },
  info: {
    backgroundColor: red[100],
    color: red[600]
  },
  doc: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  selectedCheck: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  }
});
function SimpleDialog({ className, props, ...rest }) {
  const { onClose, open } = rest;
  const classes = useStyles();

  const [state, setState] = React.useState({
    calling: false,
    mailing: false,
    information: false,
    documentation: false
  });

  const handleClose = () => {
    setState({
      calling: false,
      mailing: false,
      information: false,
      documentation: false
    });
    if (!mailing && !information && !documentation && !calling) {
      onClose('', false);
    } else {
      onClose(state, false);
    }
  };

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { calling, mailing, information, documentation } = state;

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Choose an action</DialogTitle>
      <Formik
        enableReinitialize
        initialValues={{
          actions: '',
          submit: null
        }}
        onSubmit={async (
          values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            if (
              !state.calling &&
              !state.mailing &&
              !state.information &&
              !state.documentation
            ) {
              setErrors({ submit: 'Please select at least one option' });
            } else {
              if (
                _.filter(state, function(st) {
                  if (st === true) return st;
                }).length <= 3
              ) {
                onClose(state, true);
                setState({
                  calling: false,
                  mailing: false,
                  information: false,
                  documentation: false
                });
                resetForm();
              } else {
                setErrors({ submit: 'Please select max 3 options' });
              }
            }
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <Card className={clsx(classes.root, className)} {...rest}>
              <Divider />
              <CardContent>
                <FormGroup>
                  <MenuList>
                    <MenuItem
                      className={information ? classes.selectedCheck : ''}
                      key={0}
                      onClick={e => {
                        setState({ ...state, information: !information });
                      }}
                    >
                      <Checkbox
                        style={{ display: 'none' }}
                        checked={information}
                        onChange={handleChange}
                        name="information"
                      />
                      <ListItemAvatar>
                        <Avatar className={classes.info}>
                          <InfoIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography color="textPrimary" variant="body1">
                        Information
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={documentation ? classes.selectedCheck : ''}
                      key={1}
                      onClick={e => {
                        setState({ ...state, documentation: !documentation });
                      }}
                    >
                      <Checkbox
                        style={{ display: 'none' }}
                        checked={documentation}
                        onChange={handleChange}
                        name="documentation"
                      />
                      <ListItemAvatar>
                        <Avatar className={classes.doc}>
                          <DocumentationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography color="textPrimary" variant="body1">
                        Documentation
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={mailing ? classes.selectedCheck : ''}
                      key={2}
                      onClick={e => {
                        setState({ ...state, mailing: !mailing });
                      }}
                    >
                      <Checkbox
                        style={{ display: 'none' }}
                        checked={mailing}
                        onChange={handleChange}
                        name="mailing"
                      />
                      <ListItemAvatar>
                        <Avatar className={classes.mail}>
                          <MailingIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography color="textPrimary" variant="body1">
                        Mailing
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={calling ? classes.selectedCheck : ''}
                      key={3}
                      onClick={e => {
                        setState({ ...state, calling: !calling });
                      }}
                    >
                      <Checkbox
                        style={{ display: 'none' }}
                        checked={calling}
                        onChange={handleChange}
                        name="calling"
                      />
                      <ListItemAvatar>
                        <Avatar className={classes.call}>
                          <CallingIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography color="textPrimary" variant="body1">
                        Calling
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </FormGroup>

                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}
              </CardContent>
              <Divider />
              <Box p={2} display="flex" justifyContent="flex-end">
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Send
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default SimpleDialog;
