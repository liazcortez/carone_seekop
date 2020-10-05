import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  Backdrop,
  Box,
  Button,
  Divider,
  IconButton,
  Input,
  Paper,
  Portal,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import useLead from 'src/hooks/useLead';
import {
  X as XIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon
} from 'react-feather';
import QuillEditor from 'src/components/QuillEditor';
import useMail from 'src/hooks/useMail';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: `calc(100% - ${theme.spacing(6)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
    width: 600,
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: theme.spacing(3),
    outline: 'none',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 500
  },
  fullScreen: {
    height: '100%',
    width: '100%'
  },
  input: {
    width: '100%'
  },
  editor: {
    flexGrow: 1,
    '& .ql-editor': {
      minHeight: 300
    }
  },
  action: {
    marginRight: theme.spacing(1)
  }
}));

const Compose = ({isMailOpen, setMailOpen}) => {
  const classes = useStyles();
  // const { isComposeOpen } = useSelector((state) => state.mail);
  const [fullScreen, setFullScreen] = useState(false);
  const { lead } = useLead();
  const [messageBody, setMessageBody] = useState('');
  const { createMail, getMailsByLead } = useMail();
  const { enqueueSnackbar } = useSnackbar();
  const inputFile = useRef(null) 
  const [attachments, setAttachment] = useState(null);
  const route = useParams();
  const [mail, setMail] = useState({
    email: lead.email,
    subject: '',
    message: '',
    template: 'mail'
  })

  const handleChangeMail = e=>{
    setMail({...mail, [e.target.name]: e.target.value})
  }

  useEffect(() => {
    setMail({ ...mail, lead: lead._id, email: lead.email})
    //eslint-disable-next-line
  }, [lead]);

  useEffect(() => {
    
    //eslint-disable-next-line
  }, [attachments])

  const handleChange = (value, delta, source, editor) => {
    setMessageBody(value);

    const text = editor.getText(value);
    setMail({...mail, message: text})
  };

  const handleSubmit = async () =>{
    await createMail(mail);
    setMailOpen(false);

    setMessageBody('');

    setMail({
      email: lead.email,
      subject: '',
      message: '',
      template: 'mail',
      lead: lead._id
    })
    enqueueSnackbar('Email Sent', {
      variant: 'success'
    });

    getMailsByLead(route.id);
  }

  const handleExitFullScreen = () => {
    setFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    setFullScreen(true);
  };

  const handleClose = () => {
    setMailOpen(false);
  };

  const handleAttach = () => {
   inputFile.current.click();
  };

  const fileChangeHandler = (e) =>{
    setAttachment(e.target.files[0]);
  }

   if (!isMailOpen) {
     return null;
   }

  return (
    <Portal>
      <Backdrop open={fullScreen} />
      <Paper
        className={clsx(
          classes.root,
          { [classes.fullScreen]: fullScreen }
        )}
        elevation={12}
      >
        <Box
          bgcolor="background.dark"
          display="flex"
          alignItems="center"
          py={1}
          px={2}
        >
          <Typography
            variant="h5"
            color="textPrimary"
          >
            New Message
          </Typography>
          <Box flexGrow={1} />
          {fullScreen ? (
            <IconButton onClick={handleExitFullScreen}>
              <SvgIcon fontSize="small">
                <MinimizeIcon />
              </SvgIcon>
            </IconButton>
          ) : (
            <IconButton onClick={handleEnterFullScreen}>
              <SvgIcon fontSize="small">
                <MaximizeIcon />
              </SvgIcon>
            </IconButton>
          )}
          <IconButton onClick={handleClose}>
            <SvgIcon fontSize="small">
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Box>
        <Box p={2}>
          <Input
            className={classes.input}
            disableUnderline
            placeholder="To"
            name="email"
            onChange={handleChangeMail}
            value={mail.email}
            disabled
          />
          <Input
            className={classes.input}
            disableUnderline
            name="subject"
            placeholder="Subject"
            onChange={handleChangeMail}
            value={mail.subject}
          />
        </Box>
        <Divider />
        <QuillEditor
          className={classes.editor}
          onChange={handleChange}
          name="message"
          placeholder="Leave a message"
          value={messageBody}

        />
        <Divider />
        <Box
          display="flex"
          alignItems="center"
          py={1}
          px={2}
        >
          <Button
            color="secondary"
            variant="contained"
            className={classes.action}
            onClick={handleSubmit}
          >
            Send
          </Button>
          <Tooltip title="Attach image">
            <IconButton
              size="small"
              className={classes.action}
            >
              <AddPhotoIcon />
            </IconButton>
          </Tooltip>
          <input type='file' id='file' ref={inputFile} multiple style={{display: 'none'}} onChange={fileChangeHandler}/>
          <Tooltip title="Attach file">
              <IconButton
                size="small"
                className={classes.action}
                onClick={handleAttach}
                >
                <AttachFileIcon />
              </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Portal>
  );
};

export default Compose;
