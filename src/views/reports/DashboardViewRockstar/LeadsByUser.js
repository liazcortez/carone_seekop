import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';

import leadsPerMonth from 'src/utils/leadsPerMonth';
import datesFormat from 'src/utils/datesFormat';

import leadsByStatus from 'src/utils/leadsByStatus2';

const LineChart = ({ leads, ids, showInfo, filter }) => {
  const theme = useTheme();

  const categories = datesFormat(leads, filter);

  const leadsMonth = leadsPerMonth(leads, categories, filter);

  let fix = [];

  fix.push(...ids);

  let seriesStatuses = [];
  let arrayInformation = [];
  let colorFinal = [];

  if(ids){
    fix.map( item => seriesStatuses.push(
      {
        name: Object.keys(item)[0],
        data: leadsByStatus(leads, categories, item[Object.keys(item)[0]], filter)
      }
    ))
  }

    arrayInformation.push(...seriesStatuses);
    colorFinal = {colors: [colors.blue['400'], theme.palette.primary.main,theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]};
  
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
        radius: 2,
        hover: {
          size: undefined,
          sizeOffset: 2
        }
      },
      stroke: {
        width: 1,
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
        data: leadsMonth
      },
      ...arrayInformation
    ]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
          Leads By Status
        </Typography>
          <Chart type='bar' height="500" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
