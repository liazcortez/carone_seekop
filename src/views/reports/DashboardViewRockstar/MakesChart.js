import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import makesToCount from 'src/utils/makesToCount';
import leadsByStatus from 'src/utils/leadsByStatusMake';
import _ from 'lodash';
const LineChart = ({ leads, ids, showInfo, filter }) => {
  const theme = useTheme();

  const arrMakes = makesToCount(leads);

  const categories = _.uniqBy(arrMakes);

  const makesLeads = leadsPerMake(arrMakes);

  let fix = [];

  fix.push(...ids);

  let seriesStatuses = [];
  let arrayInformation = [];
  let colorFinal = [];

  if(ids){
    fix.map( item => seriesStatuses.push(
      {
        name: Object.keys(item)[0],
        data: leadsByStatus(leads, categories, item[Object.keys(item)[0]])
      }
    ))
  }

    arrayInformation.push(...seriesStatuses);
    colorFinal = {colors: [theme.palette.primary.main, theme.palette.primary.main, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]};
  
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
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function(value, { seriesIndex, dataPointIndex, w }) {
          return value
        },  
        textAnchor: 'middle',
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, sans-serif',
          fontWeight: '700',
          colors: ["#fff"]
        },
        offsetY: -20
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top'
          }
        }
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
        data: makesLeads
      },
      // ...arrayInformation
    ]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
          Leads By Make
        </Typography>
          <Chart type='bar' height="500" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
