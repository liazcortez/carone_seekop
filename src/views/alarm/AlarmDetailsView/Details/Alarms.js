import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import useStore from 'src/hooks/useStore';

const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));


const Alarm = ({ stores, ArrayBol, className, ...rest }) => {
  const classes = useStyles();
  const { updateStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();  

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Alarms By Store" />
      <Divider />
      <Table>
        <TableBody>
          {
            ArrayBol.length > 0 ? stores.map( (store, index) => (<TableRow key={store._id}>
                  <TableCell className={classes.fontWeightMedium}>
                   {store.make.name + ' ' + store.name}
                  </TableCell>
                  <TableCell>
                  <FormControlLabel
                      control={(
                        <Switch
                          checked={ArrayBol[index]}
                          edge="start"
                          name="direction"
                          onClick={(e)=>{
                            ArrayBol[index] = !ArrayBol[index];

                            const funct = async()=>{
                              await updateStore({alarm: ArrayBol[index]},store._id)

                              if(ArrayBol[index]){
                                enqueueSnackbar(`Alarms for ${store.make.name + ' ' + store.name} has been turned on`, {
                                  variant: 'success'
                                });
                              }else{
                                enqueueSnackbar(`Alarms for ${store.make.name + ' ' + store.name} has been turned off`, {
                                  variant: 'warning'
                                });
                              }
                              
                            }

                            funct();
                        }}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>)
            )  :false
          }
          
        </TableBody>
      </Table>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      ></Box>
    </Card>
  );
};

Alarm.propTypes = {
  className: PropTypes.string,
};

export default Alarm;
