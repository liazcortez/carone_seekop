import React, {
  useState,
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import { Divider, makeStyles } from '@material-ui/core';
import Toolbar from './Toolbar';
import useMail from 'src/hooks/useMail';
import MailItem from './MailItem';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.dark
  }
}));

const MailList = () => {
  const classes = useStyles();
  const params = useParams();
  const { mails, getMailsByLead } = useMail();
  const [selectedMails, setSelectedMails] = useState([]);

  useEffect(()=>{
    getMailsByLead('5f724e9b3b5ddc1be8065607')
    //eslint-disable-next-line
  },[])

  const handleSelectAllMails = () => {
    // setSelectedMails(mails.allIds.map((mailId => mailId)));
  };

  const handleDeselectAllMails = () => {
    setSelectedMails([]);
  };

  const handleSelectOneMail = (mailId) => {
    setSelectedMails((prevSelectedMails) => {
      if (!prevSelectedMails.includes(mailId)) {
        return [...prevSelectedMails, mailId];
      }

      return prevSelectedMails;
    });
  };
   
  const handleDeselectOneMail = (mailId) => {
    setSelectedMails((prevSelectedMails) => prevSelectedMails.filter((id) => id !== mailId));
  };

  useEffect(() => {
    // dispatch(getMails(params));
  }, [ params]);

  return (
    <div className={classes.root}>
      <Toolbar
        onDeselectAll={handleDeselectAllMails}
        onSelectAll={handleSelectAllMails}
        selectedMails={selectedMails.length}
        // mails={mails.allIds.length}
      />
      <Divider />
      {mails.map((mailId) => (
        <MailItem
          mail={mailId}
          key={mailId._id}
          onDeselect={() => handleDeselectOneMail(mailId)}
          onSelect={() => handleSelectOneMail(mailId)}
          selected={selectedMails.includes(mailId)}
        />
      ))}
    </div>
  );
}

export default MailList;
