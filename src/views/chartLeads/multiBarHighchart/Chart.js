import React from 'react';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import leadsByStatus from 'src/utils/leadsByStatus';
import leadsBySource from 'src/utils/leadsBySource';

import modelsToCount from 'src/utils/modelsToCount';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
  let cont = 0;
  const statusColors= [theme.palette.primary.main, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]
  const sourceColors= [
    theme.palette.primary.main,
    colors.deepPurple['700'],
    colors.deepPurple['600'],
    colors.deepPurple['500'],
    colors.deepPurple['400'], 
    colors.deepPurple['300'], 
    colors.deepPurple['200'], 
    colors.deepPurple['100'], 
    colors.deepPurple['50'] 
  ]

  if(ids){
    fix.map( item => {seriesStatuses.push(
      {
        name: Object.keys(item)[0],
        data: leadsByStatus(leads, categories, item[Object.keys(item)[0]]),
        color: statusColors[cont]
      }
    ); cont++
    return false;
    }
    )
  }

  if(idsS){
    fix2.map( item => {seriesSources.push(
      {
        name: Object.keys(item)[0],
        data: leadsBySource(leads, categories, item[Object.keys(item)[0]]),
        color: sourceColors[cont]
      }
    );cont++
    return false;
  })
  }

  cont = 0;
  
  if(showInfo === 'statuses'){
    arrayInformation.push(...seriesStatuses);
  }else{
    arrayInformation.push(...seriesSources)
  }


  const options = {
    chart: {
      type: type,
      backgroundColor: theme.palette.background.paper,
      style: {
        color: theme.palette.divider
      }
    },
    legend: {
      itemStyle: {
          color: theme.palette.text.primary,
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      series: {
        dataLabels: { 
          enabled: true, 
          inside: false,
          overflow: 'none',
          crop: true,
          color: 'rgba(255,255,255,1)',
          y: -10,
          style: {
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: 'normal',
            textShadow: 'none',

          },
          formatter: function() {
            return  Highcharts.numberFormat(this.y,0)
          }
        }
      },
      column: {
        borderWidth: 0,
        color: theme.palette.primary.main
      },
      line: {
        borderWidth: 1,
        color: theme.palette.primary.main
      }
    },
    title: {
      text: '',
      style: {
        color: theme.palette.divider
      }
    },
    xAxis: {
      categories: categories,
      lineColor: theme.palette.divider,
      labels: {
         style: {
            color: theme.palette.text.primary,
         }
      },
    },
    yAxis: [
      {
        title: {
          text: '',
          style: {
            color: theme.palette.text.primary
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          }
        },
        gridLineColor: theme.palette.divider,
        lineColor: theme.palette.divider,
        lineWidth: 1
      },
      {
        title: {
          text: '',
          style: {
            color: theme.palette.text.primary
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          }
        },
        opposite: true,
        lineColor: theme.palette.divider,
        lineWidth: 1
      }
    ],
    series: [
      {
        name: 'Leads',
        data: makesLeads,
        color: showInfo === 'statuses' ? colors.blue[400] :theme.palette.primary.main,
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
          <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
