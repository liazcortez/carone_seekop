import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useMail from 'src/hooks/useMail';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  Grid
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import GenericMoreButton from 'src/components/GenericMoreButton';
import ModalMail from './Details/ModalMail';
import SendEmail from './Details/SendEmail';
import { useParams } from 'react-router';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Invoices = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [invoices, setInvoices] = useState([]);
  const [ isMailOpen, setMailOpen] = useState(false)
  const { mails, getMailsByLead } = useMail();
  const route = useParams();

  useEffect(()=>{
    getMailsByLead(route.id)
    //eslint-disable-next-line
  },[])

  const getInvoices = useCallback(async () => {
    try {
      const response = await axios.get('/api/customers/1/invoices');

      if (isMountedRef.current) {
        setInvoices(response.data.invoices);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  return (
    <Grid
    className={clsx(classes.root, className)}
    container
    spacing={3}
    {...rest}
  >
    <Grid item lg={9} md={9} xl={9} xs={12}>
          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <CardHeader
              action={<GenericMoreButton />}
              title="Mails to user"
            />
            <Divider />
            <PerfectScrollbar>
              <Box >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Created At</TableCell>
                      {/* <TableCell align="right">Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mails && mails.map((mail) => (
                      <TableRow key={mail._id + mail.createdAt}>
                        <TableCell>
                          {mail && mail.subject}
                        </TableCell>
                        <TableCell>
                          {mail && mail.message}
                        </TableCell>
                        <TableCell>
                          {mail && moment(mail.createdAt).format('ll')}
                        </TableCell>
                        {/* <TableCell align="right">
                          <IconButton
                            component={RouterLink}
                            to="/app/management/invoices/1"
                          >
                            <SvgIcon fontSize="small">
                              <ArrowRightIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <TablePagination
              component="div"
              count={invoices.length}
              onChangePage={() => {}}
              onChangeRowsPerPage={() => {}}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </Grid>
        <Grid item sm={3} lg={3} md={3} xl={3} xs={12}>
          <SendEmail setMailOpen={setMailOpen} style={{ marginBottom: '1em' }} />
          <ModalMail isMailOpen={isMailOpen} setMailOpen={setMailOpen} style={{ marginBottom: '1em' }} />
        </Grid>
      </Grid>
    
  );
};

Invoices.propTypes = {
  className: PropTypes.string
};

export default Invoices;
