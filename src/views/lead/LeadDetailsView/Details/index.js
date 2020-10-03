import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import CustomerInfo from './CustomerInfo';
import CallUser from './CallUser';
import StatusLead  from './StatusLead';
import Appointments from './Appointments';
import AddAgent from './AddAgent';
import PostAdd from 'src/components/PostAdd';
import Reviews from 'src/views/project/ProjectDetailsView/Reviews';
import useComment from 'src/hooks/useComment';
import { useParams } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({ customer, className, ...rest }) => {
  const classes = useStyles();
  const { comments, getCommentsByLead } = useComment();
  const { user } = useAuth();
  const route = useParams();
  // const [ isMailOpen, setMailOpen] = useState(false)

  useEffect(() => {
    getCommentsByLead(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <CustomerInfo customer={customer} />
      </Grid>
      <Grid item lg={6} md={6} xl={6} xs={12}>
        <PostAdd style={{ marginBottom: '1em' }} />

        <Reviews reviews={comments} />
      </Grid>

        <Grid item lg={3} md={3} xl={3} xs={12}>
          <StatusLead lead={route.id} style={{ marginBottom: '1em' }} />
          {/* <SendEmail setMailOpen={setMailOpen} style={{ marginBottom: '1em' }} /> */}
          <Appointments style={{ marginBottom: '1em' }} />
          {/* <CallUser user={user} customer={customer} style={{ marginBottom: '1em' }} /> */}
          {/* <ModalMail isMailOpen={isMailOpen} setMailOpen={setMailOpen} style={{ marginBottom: '1em' }} /> */}
          {user.role === 'rockstar' || user.role === 'admin' || user.role === 'super admin' ? (
          <AddAgent style={{ marginBottom: '1em' }} />
          ) : (
          false
        )}
        </Grid>
      
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default Details;
