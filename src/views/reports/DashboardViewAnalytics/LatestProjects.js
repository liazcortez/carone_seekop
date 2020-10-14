import React, {
  useEffect,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
//import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Label from 'src/components/Label';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  Card,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import GenericMoreButton from 'src/components/GenericMoreButton';
import useLead from 'src/hooks/useLead';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {},
  technology: {
    height: 30,
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const LatestProjects = ({ className, ...rest }) => {
  const classes = useStyles();
  const { lastLeads, getLeadsAR } = useLead();
  const { user } = useAuth();
  useEffect(() => {

    if(user.role && user.role !== 'rockstar' && user.role !== 'super admin'){
      getLeadsAR(`&store=${user.store._id}`,'latest');
    }else{
      getLeadsAR('','latest');
    }

    //eslint-disable-next-line
  }, [user])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Latest Leads"
      />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={900}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Down Payment</TableCell>
                <TableCell>Timeframe</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lastLeads && lastLeads.map((lead) => (
                <TableRow
                  hover
                  key={lead._id}
                >
                  <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/leads/${lead._id}`}
                            variant="h6"
                          >
                            {lead && lead.name ? lead.name : 'No Name'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{lead && lead.email ? lead.email : 'No Email'}</TableCell>
                    <TableCell>{lead && lead.phone ? lead.phone : 'No Phone'}</TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.make && lead.vehicle.make.name ? lead.vehicle.make.name : 'No Make'}
                    </TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.model ? lead.vehicle.model : 'No model'}
                    </TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.year ? lead.vehicle.year : 'No Year'}
                    </TableCell>
                    <TableCell>   
                        {lead && lead.source && lead.source.name ? lead.source.name : 'No Source'}                
                    </TableCell>
                    <TableCell>   
                        {lead && lead.downPayment ? 
                          <NumberFormat value={lead.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> : 'None'
                        }                
                    </TableCell>
                    <TableCell>   
                        {/*lead && lead.timeFrame ? moment(lead.timeFrame).format('ll') : 'None'*/}   
                        {lead && lead.timeFrame && lead.timeFrame ?
                        (
                          moment(lead.timeFrame).isSame(moment(), 'day') ? moment(lead.timeFrame).calendar() :
                          moment(lead.timeFrame).diff(moment(), 'days') >= 1  && 
                          moment(lead.timeFrame).diff(moment(), 'days') < 8 ? moment(lead.timeFrame).calendar() : 
                          moment(lead.timeFrame).format('ll')
                        ): 'None'
                        } 
                    </TableCell>
                    <TableCell>   
                        {lead && lead.createdAt ? moment(lead.createdAt).format('ll') : ''}                
                    </TableCell>
                    <TableCell>
                        <Label
                          className={classes.capitalize}
                          color={lead && lead.status && 
                            lead.status.name === 'sold' ? 'error' :
                            lead.status.name === 'documentation' ? 'warning' : 
                            lead.status.name === 'new' ? 'success' : 'primary'}
                        >   
                        {lead && lead.status && lead.status.name ? lead.status.name : ''}
                        </Label>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        p={2}
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          component={RouterLink}
          size="small"
          to="/app/management/leads"
          endIcon={<NavigateNextIcon />}
        >
          See all
        </Button>
      </Box>
    </Card>
  );
};

LatestProjects.propTypes = {
  className: PropTypes.string
};

export default LatestProjects;
