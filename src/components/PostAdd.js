/* eslint no-lone-blocks: 0 */
import React, {
  useState,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SimpleDialog from './DialogActionMessage';
import {
  Card,
  Box,
  Paper,
  Input,
  Tooltip,
  IconButton,
  CardContent,
  makeStyles,
  CardHeader,
  Divider
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import useAuth from 'src/hooks/useAuth';
import useComment from 'src/hooks/useComment';
import { useParams } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  root: {},
  inputContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.5)
  },
  divider: {
    height: 24,
    width: 1
  },
  fileInput: {
    display: 'none'
  },
  menulist: {}
}));

const PostAdd = ({ className, ...rest } ) => {
  const classes = useStyles();
  const fileInputRef = useRef(null);
  const [value, setValue] = useState('');
  const { user } = useAuth();
  const { createComment, getCommentsByLead } = useComment();
  const route = useParams();

  const [openAction, setOpenAction] = React.useState(false);

  const handleCloseAction =  async (valor, status) =>{
    setOpenAction(false);
    if(status){
      await createComment({comment: value, user: user._id, actions: valor}, route.id)
      await getCommentsByLead(route.id)
      setValue('');
    }
    

  }
  const handleChange = (event) => {
    event.persist();
    setValue(event.target.value);
  };

{/*
  const handleAttach = () => {
    fileInputRef.current.click();
  }; */}

  const onSubmit = async e => {
    e.preventDefault();
    if(value !== ''){
      setOpenAction(true);
    }
    
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && value !== '') {
      setOpenAction(true);
    }
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <SimpleDialog open={openAction} onClose={handleCloseAction} />
      <CardHeader title="Follow up" />
        <Divider />
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
        >
          
          <Paper
            className={classes.inputContainer}
            variant="outlined"
          >
            <Input
              placeholder={`What's on your mind, ${user.name}`}
              disableUnderline
              fullWidth
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={value}
            />
          </Paper>
          <Tooltip title="Send">
            <IconButton color={value.length > 0 ? 'primary' : 'default'} onClick={onSubmit}>
                <SendIcon />
            </IconButton>
          </Tooltip>
          <input
            className={classes.fileInput}
            ref={fileInputRef}
            type="file"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

PostAdd.propTypes = {
  className: PropTypes.string
};

export default PostAdd;
