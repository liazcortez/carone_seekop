import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import leadsByStatusUser from 'src/utils/leadsByStatusUser';

import usersToCount from 'src/utils/usersToCount';

import _ from "lodash";

const LineChart = ({ leads, ids, showInfo }) => {
  const theme = useTheme();

  let fix = [];

  fix.push(...ids);

  const arrUsers = usersToCount(leads);

  arrUsers.map((item, index) => {
    if(item === 'none'){
      arrUsers.splice(index, 1);
    }
    return false;
  });

  const categories = _.uniqBy(arrUsers);
  
  const makesLeads = leadsPerMake(arrUsers);


  let seriesStatuses = [];
  let arrayInformation = [];
  let colorFinal = [];

  if(ids){
    fix.map( item => seriesStatuses.push(
      {
        name: Object.keys(item)[0],
        data: leadsByStatusUser(leads, categories, item[Object.keys(item)[0]])
      }
    ))
  }

    arrayInformation.push(...seriesStatuses);
    colorFinal = {colors: [colors.blue['400'], theme.palette.primary.main, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]};
  
    const chart = {
    options: {
      chart: {
        background: theme.palette.background.paper,
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: false
      },
      ...colorFinal,
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: theme.palette.divider,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: theme.palette.text.secondary
        }
      },
      markers: {
        size: 4,
        strokeColors: ['#1f87e6', '#27c6db'],
        strokeWidth: 0,
        shape: 'circle',
        radius: 2,
        hover: {
          size: undefined,
          sizeOffset: 2
        }
      },
      stroke: {
        width: 1,
        curve: 'smooth',
        lineCap: 'butt',
        dashArray: [0, 3]
      },
      theme: {
        mode: theme.palette.type
      },
      tooltip: {
        theme: theme.palette.type
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider
        },
        axisTicks: {
          show: false,
          color: theme.palette.divider
        },
        categories: categories,
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: theme.palette.divider
          },
          axisTicks: {
            show: true,
            color: theme.palette.divider
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          },
          seriesName: 'Leads'

        }
      ]
    },
    series: [
      {
        name: 'Leads',
        data: makesLeads
      },
      ...arrayInformation
    ]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
          Leads
        </Typography>
          <Chart type='bar' height="500" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
