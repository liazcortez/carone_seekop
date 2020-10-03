import React, {
  useRef,
  useState
} from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
// import { getLabels } from 'src/slices/mail';
import Sidebar from './Sidebar';
import MailList from './MailList';
import MailDetails from './MailDetails';
import Compose from './Compose';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative'
  }
}));

const MailView = () => {
  const classes = useStyles();
  const { mailId } = useParams();
  const pageRef = useRef(null);
  const [isMailOpen, setMailOpen] = useState(false);

  // useEffect(() => {
  //   dispatch(getLabels());
  // }, [dispatch]);

  return (
    <Page
      className={classes.root}
      title="Mail"
      ref={pageRef}
    >
      <Sidebar setMailOpen={setMailOpen} containerRef={pageRef} />
      {mailId ? <MailDetails /> : <MailList />}
      <Compose isMailOpen={isMailOpen} setMailOpen={setMailOpen}/>
    </Page>
  );
};

export default MailView;
