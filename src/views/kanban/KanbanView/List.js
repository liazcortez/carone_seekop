import React, {
  useState,
  useRef,
  useEffect
} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { MoreVertical as MoreIcon } from 'react-feather';
import Card from './Card';
import CardAdd from './CardAdd';

const useStyles = makeStyles((theme) => ({
  root: {},
  inner: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'hidden',
    overflowX: 'hidden',
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: 300
    }
  },
  title: {
    cursor: 'pointer'
  },
  droppableArea: {
    minHeight: 80,
    flexGrow: 1,
    overflowY: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  menu: {
    width: 240
  }
}));

const List = ({ className, item, board, ...rest }) => {
  const classes = useStyles();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const moreRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(item.name);
  const [isRenaming, setRenaming] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleChange = (event) => {
    event.persist();
    setName(event.target.value);
  };

  const handleRenameInit = () => {
    setRenaming(true);
    setMenuOpen(false);
  };

  const handleRename = async () => {
    try {
      if (!name) {
        setName(item.name);
        setRenaming(false);
        return;
      }

      //const update = { name };

      setRenaming(false);
      //await dispatch(updateList(list.id, update));
      enqueueSnackbar('List updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      setMenuOpen(false);
      //await dispatch(deleteList(list.id));
      enqueueSnackbar('List deleted', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleClear = async () => {
    try {
      setMenuOpen(false);
      //await dispatch(clearList(list.id));
      enqueueSnackbar('List cleared', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    //setList(listId)
    //eslint-disable-next-line
  }, [])

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Paper className={classes.inner}>
        <Box
          py={1}
          px={2}
          display="flex"
          alignItems="center"
        >
          {isRenaming ? (
            <ClickAwayListener onClickAway={handleRename}>
              <TextField
                value={name}
                onBlur={handleRename}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
              />
            </ClickAwayListener>
          ) : (
            <Typography
              color="inherit"
              variant="h5"
              onClick={handleRenameInit}
            >
              {name}
            </Typography>
          )}
          <Box flexGrow={1} />
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMenuOpen}
            ref={moreRef}
          >
            <SvgIcon fontSize="small">
              <MoreIcon />
            </SvgIcon>
          </IconButton>
        </Box>
        <Divider />
        <Droppable
          droppableId={item && item.value}
          type="card"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              className={classes.droppableArea}
            >
              {item && item.tasks.map((cardId, index) => (
                <Draggable
                  draggableId={cardId._id}
                  index={index}
                  key={cardId._id}
                >

                  {(provided, snapshot) => (
                    <Card
                      cardId={cardId._id}
                      dragging={snapshot.isDragging}
                      index={index}
                      key={cardId._id}
                      list={cardId}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                  
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Divider />
        <Box p={2}>
          <CardAdd listId={item.value} />
        </Box>
        <Menu
          keepMounted
          anchorEl={moreRef.current}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          PaperProps={{ className: classes.menu }}
          getContentAnchorEl={null}
        >
          <MenuItem onClick={handleRenameInit}>
            Rename
          </MenuItem>
          <MenuItem onClick={handleClear}>
            Clear
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </div>
  );
};

List.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired
};

export default List;