import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, useTheme, makeStyles, CardHeader, Divider } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import GenericMoreButton from 'src/components/GenericMoreButton';
import leadsPerMake from 'src/utils/leadsPerMake';
import makesToCount from 'src/utils/makesToCount';
import _ from "lodash";

const useStyles = makeStyles(() => ({
  root: {},
  chart: {
    height: '100%'
  }
}));

const LineChart = ({leads, filter, className, ...rest}) => {
  const theme = useTheme();

  const arrMakes = makesToCount(leads);

  const categories = _.uniqBy(arrMakes);

  const makesLeads = leadsPerMake(arrMakes);

  const classes = useStyles();

  const chart = {

    options: {
      labels: categories,
      theme: {
        monochrome: {
          enabled: true,
          color: theme.palette.primary.main,
          shadeTo: 'light',
          shadeIntensity: 0.65
        }
      },  
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,      
      },    
      legend: {
        show: true,
        labels: {
          colors: theme.palette.text.secondary
        }
      }
    },
      series: makesLeads,
  }

  return (
  
    <Card className={clsx(classes.root, className)}
    {...rest}>
      <CardHeader
        action={<GenericMoreButton />}
        title={`Leads of ${rest.title}`}
      />
      <Divider />
      <CardContent>
      <PerfectScrollbar>
        <Chart className={classes.chart} {...chart} type="donut" />

        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

export default LineChart;
