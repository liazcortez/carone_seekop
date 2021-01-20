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
  Typography,
  makeStyles,
  Checkbox,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next'
import useDocument from 'src/hooks/useDocument';
import { useSnackbar } from 'notistack';
import Spinner from 'src/components/Spinner';
import useQuestLead from 'src/hooks/useQuestLead';
import {
  X as XIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon
} from 'react-feather';
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
  const { questLead } = useQuestLead();
  const { t } = useTranslation()
  const { getDocumentsByStore, documents } = useDocument();
  const { createMailAttachment, loading } = useMail();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState(null);
  const [files, setFiles] = useState([]);
  const [buttonState, setButtonState] = useState(true)
  const [attachments, setAttachment] = useState([]);
  const [mail, setMail] = useState({
    email: questLead.email,
    subject: '',
    message: '',
    template: 'mail',
    type: 'quest'

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
        return 0
      })
    }
    setAttachment(files)
    //eslint-disable-next-line
  },[state])

  useEffect(() => {
      setMail({ ...mail, global: questLead._id, email: questLead.email})
    //eslint-disable-next-line
  }, [questLead]);

  useEffect(() => {
  
      if(questLead.store)
      getDocumentsByStore(questLead.store._id)
    //eslint-disable-next-line
  }, [questLead])

  const handleSubmit = async () =>{
    await createMailAttachment(mail, attachments);
    setMailOpen(false);
    setMail({
      email: questLead.email,
      subject: '',
      message: '',
      template: 'mail',
      global: questLead._id,
      type: 'global'
    })
    enqueueSnackbar(t("SnackBar.EmailSent"), {
      variant: 'success'
    });

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
           {t("Email.NewMessage")}
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
            placeholder={t("Email.Subject")}
            onChange={handleChangeMail}
            value={mail.subject}
            required
          />
        </Box>
        
        <Divider />
        <Box>
        {
          documents && documents.length > 0 ? (
            <Typography style={{display: 'inline-block', paddingLeft: 15}} variant='h6' color='textPrimary'>{t("Email.Documentation")}: </Typography>
          ): false
          
        }
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
          placeholder={t("Email.Message")}
          className={classes.editor}
          style={{padding: 15, paddingTop: 5}}
          name="message"
          onChange={handleChangeMail}
          value={mail.message}
          required
        />
        <Divider />
        <Box
          display="flex"
          alignItems="center"
          py={1}
          px={2}
        >
          {loading ? (
            <>
              <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Sending")}</Typography><Spinner style={{paddingRight: 20}} width={25}/>
            </>
          ) : 
          (<Button
            color="secondary"
            variant="contained"
            className={classes.action}
            onClick={handleSubmit}
            disabled={buttonState}
          > {t("Buttons.Send")}
          </Button>
         )
          }
        </Box>
      </Paper>
    </Portal>
  );
};

export default Compose;
