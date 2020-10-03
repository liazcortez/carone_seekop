import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import leadsByStatus from 'src/utils/leadsByStatus';
import leadsBySource from 'src/utils/leadsBySource';

import modelsToCount from 'src/utils/modelsToCount';

import _ from "lodash";

const LineChart = ({ leads, filter, type, ids, idsS, showInfo }) => {
  const theme = useTheme();

  let fix = [];
  let fix2 = [];

  fix.push(...ids);
  fix2.push(...idsS);

  const arrMakes = modelsToCount(leads);

  const categories = _.uniqBy(arrMakes);
  
  const makesLeads = leadsPerMake(arrMakes);

  let seriesStatuses = [];
  let seriesSources = [];
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

  if(idsS){
    fix2.map( item => seriesSources.push(
      {
        name: Object.keys(item)[0],
        data: leadsBySource(leads, categories, item[Object.keys(item)[0]])
      }
    ))
  }
  if(showInfo === 'statuses'){
    arrayInformation.push(...seriesStatuses);
    colorFinal = {colors: [colors.blue['400'], theme.palette.primary.main, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]};
  }else{
    arrayInformation.push(...seriesSources)
    colorFinal = {
      colors: [
              theme.palette.primary.main,
              colors.deepPurple['700'],
              colors.deepPurple['600'],
              colors.deepPurple['500'],
              colors.deepPurple['400'], 
              colors.deepPurple['300'], 
              colors.deepPurple['200'], 
              colors.deepPurple['100'], 
              colors.deepPurple['50'], 
            ]};
  }

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
          return [w.globals.labels[dataPointIndex] + ' ' + w.config.series[seriesIndex].name, "Total:  " + value]
        },  
        textAnchor: 'middle',
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, sans-serif',
          fontWeight: '700',
          colors: ["#fff"]
        },
        background: {
          enabled: true,
          foreColor: '#444',
          borderRadius: 2,
          borderWidth: 0.5,
          borderColor: '#000',
          opacity: 0.7,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top'
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
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
        curve: 'smooth',
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
          <Chart type={type} height="500" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
