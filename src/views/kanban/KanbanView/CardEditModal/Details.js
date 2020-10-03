import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import _ from 'lodash';
import wait from 'src/utils/wait';
import { useSnackbar } from 'notistack';
import {
  Box,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import useTask from 'src/hooks/useTask';
const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({
  card,
  className,
  list,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateTask, getTasks } = useTask();
  const handleUpdate = _.debounce(async (update) => {
    try {

      ////await dispatch(updateCard(card.id, update));
      await updateTask(update, card.id);
      await wait(1000);
      await getTasks();

      enqueueSnackbar('Card updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  }, 1000);

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box mt={3}>
        <TextField
          variant="outlined"
          fullWidth
          defaultValue={card.title}
          onChange={(event) => handleUpdate({ title: event.target.value })}
          label="Card Title"
        />
      </Box>
      <Box mt={3}>
        <Typography
          variant="h4"
          color="textPrimary"
        >
          Description
        </Typography>
        <Box mt={2}>
          <TextField
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            onChange={(event) => handleUpdate({ description: event.target.value })}
            placeholder="Leave a message"
            defaultValue={card.description}
          />
        </Box>
      </Box>
    </div>
  );
}

Details.propTypes = {
  card: PropTypes.object.isRequired,
  className: PropTypes.string,
  list: PropTypes.object.isRequired
};

export default Details;
