import React, { useState, useEffect } from 'react';
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
  makeStyles,
  MenuItem,
  Checkbox,
  TextField
} from '@material-ui/core';
import { useParams } from 'react-router';
import useDocument from 'src/hooks/useDocument';
import { useSnackbar } from 'notistack';
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

let ArrayName = {};
let ArrayFiles = {};

const Compose = ({isMailOpen, setMailOpen, store}) => {
  const classes = useStyles();
  const [fullScreen, setFullScreen] = useState(false);
  const route = useParams();
  const { lead } = useLead();
  const { getDocumentsByStore, documents } = useDocument();
  const [messageBody, setMessageBody] = useState('');
  const { createMailAttachment, getMailsByLead } = useMail();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState(null);
  const [files, setFiles] = useState([]);
  const [buttonState, setButtonState] = useState(true)
  const [attachments, setAttachment] = useState([]);
  const [mail, setMail] = useState({
    email: lead.email,
    subject: '',
    message: '',
    template: 'mail'
  })

  const handleChangeMail = e=>{
    setMail({...mail, [e.target.name]: e.target.value})
  }

  const handleChangeInputs = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(()=>{
    if(documents){
      documents.map(doc => ArrayName[doc.title] = false);
      setState(ArrayName)

      documents.map(doc => ArrayFiles[doc.title] = doc);
    }
    //eslint-disable-next-line
  },[documents])

  useEffect(()=>{
    if(mail){
      if(mail.message === '' || mail.subject === ''){
        setButtonState(true)
      }else{
        setButtonState(false)

      }
    }
    //eslint-disable-next-line
  },[mail])

  useEffect(()=>{
    const keys = [];
    for (var k in ArrayFiles) keys.push(k);
    setAttachment([])
    setFiles([])

    if(state !== null){
      keys.map(item => {
        if(state[item]){
          files.push(ArrayFiles[item])
        }
      })
    }
    setAttachment(files)
    //eslint-disable-next-line
  },[state])

  useEffect(() => {
    setMail({ ...mail, lead: lead._id, email: lead.email})
    //eslint-disable-next-line
  }, [lead]);

  useEffect(() => {
    if(lead.store)
    getDocumentsByStore(lead.store._id)
    //eslint-disable-next-line
  }, [lead])

  // const handleChange = (value, delta, source, editor) => {
  //   setMessageBody(value);
  //   const text = editor.getText(value);
  //   setMail({...mail, message: text})
  // };

  const handleSubmit = async () =>{
    await createMailAttachment(mail, attachments);
    // await createMail(mail);
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
            required
          />
        </Box>
        <Divider />
        <Box>
        <Typography style={{display: 'inline-block', paddingLeft: 15}} variant='h6' color='textPrimary'>Documentation: </Typography>
        {
            state !== null  && documents && documents.map(doc => (
              <Button
              key={doc._id}
              name={doc.title}
              onClick={(e) => {
                setState({ ...state, [doc.title]: !state[doc.title] });
              }}
            >
              <Checkbox checked={state[doc.title] || false} onChange={handleChangeInputs} name={doc.title}/>   
              <Typography style={{textTransform: 'capitalize'}} variant='h6' color='textPrimary'>{doc.title}</Typography>            

            </Button>
            ))
          }
        </Box>

        <Divider />
        <Input
          multiline
          rows={fullScreen ? 25 : 5}
          disableUnderline
          placeholder="Leave a message"
          className={classes.editor}
          style={{padding: 15, paddingTop: 5}}
          name="message"
          onChange={handleChangeMail}
          value={mail.message}
          required
        />
        {/* <QuillEditor
          className={classes.editor}
          onChange={handleChange}
          name="message"
          placeholder="Leave a message"
          value={messageBody}
        /> */}
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
            disabled={buttonState}
          >
            Send
          </Button>
         
          
        </Box>
      </Paper>
    </Portal>
  );
};

export default Compose;
