/*eslint no-unused-vars: 0*/
import React, {
  forwardRef,
  useState,
  useEffect,
} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card as MuiCard,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import CardEditModal from './CardEditModal';

/*
const cardSelector = (state, cardId) => {
  const { cards, members, } = state.kanban;
  const card = cards.byId[cardId];

  return {
    ...card,
    members: card.memberIds.map((memberId) => members.byId[memberId]),
  };
};
*/
const useStyles = makeStyles((theme) => ({
  root: {
    outline: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  card: {
    '&:hover': {
      backgroundColor: theme.palette.background.dark
    }
  },
  dragging: {
    backgroundColor: theme.palette.background.dark
  },
  cover: {
    height: 200
  },
  badge: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const Card = forwardRef(({
  cardId,
  className,
  dragging,
  index,
  list,
  style,
  ...rest
}, ref) => {
  const classes = useStyles();
  const [card, setCard] = useState(list);
  const [isOpened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  return (
    <div
      className={clsx(classes.root, className)}
      index={index}
      ref={ref}
      style={style}
      {...rest}
    >
      <MuiCard
        className={clsx(
          classes.card,
          { [classes.dragging]: dragging }
        )}
        raised={dragging}
        variant={dragging ? 'elevation' : 'outlined'}
        onClick={handleOpen}
      >
        {/*card && card.cover && (
          <CardMedia
            className={classes.cover}
            image={card && card.cover}
          />
        )*/}
        <CardContent>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            {card && card.title}
          </Typography>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            {/*card && card.isSubscribed && card.isSubscribed && (
              <SvgIcon
                className={classes.badge}
                color="action"
                fontSize="small"
              >
                <EyeIcon />
              </SvgIcon>
            )*/}
            {/*card && card.attachments && card.attachments.length > 0 && (
              <SvgIcon
                className={classes.badge}
                color="action"
                fontSize="small"
              >
                <FileIcon />
              </SvgIcon>
            )*/}
            {/*card && card.checklists && card.checklists.length > 0 && (
              <SvgIcon
                className={classes.badge}
                color="action"
                fontSize="small"
              >
                <CheckIcon />
              </SvgIcon>
            )*/}
            {/*card && card.comments && card.comments.length > 0 && (
              <SvgIcon
                className={classes.badge}
                color="action"
                fontSize="small"
              >
                <MessageIcon />
              </SvgIcon>
            )*/}
            <Box flexGrow={1} />
            {/*card && card.members && card.members.length > 0 && (
              <AvatarGroup max={5}>
                {card.members.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                  />
                ))}
              </AvatarGroup>
            )*/}
          </Box>
        </CardContent>
      </MuiCard>
      <CardEditModal
        open={isOpened}
        onClose={handleClose}
        card={card}
        list={list}
      />
    </div>
  );
});

Card.propTypes = {
  cardId: PropTypes.string.isRequired,
  className: PropTypes.string,
  dragging: PropTypes.bool.isRequired,
  index: PropTypes.number,
  list: PropTypes.object.isRequired,
  style: PropTypes.object
};

Card.defaultProps = {
  dragging: false,
  style: {}
};

export default Card;
