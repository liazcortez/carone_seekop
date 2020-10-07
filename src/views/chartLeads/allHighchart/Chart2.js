import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import makesToCount from 'src/utils/makesToCount';
import datesFormat from 'src/utils/datesFormat'; 
import leadsPerMonth from 'src/utils/leadsPerMonth';
import _ from "lodash";
import generateColor from 'src/utils/createColorsGradient';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = ({ leads, filter, type, labels }) => {
  const theme = useTheme();

  let arrMakes;
  let categories;
  let makesLeads;

  if(labels === 0){

    arrMakes = datesFormat(leads, filter);

    categories = _.uniqBy(arrMakes);
    
    makesLeads = leadsPerMonth(leads, categories, filter);

  }else{
    arrMakes = makesToCount(leads);

    categories = _.uniqBy(arrMakes);

    makesLeads = leadsPerMake(arrMakes);

  }

  let finalSerie = [];

  makesLeads.map( (item, i) =>{
    finalSerie.push({
      y: item,
      color: theme.palette.primary.main
    })
    return false;
  });

  let colores = generateColor('#ffffff', theme.palette.primary.main, 12)

  let cakeLabels = [];
  categories.map( (item, i ) => {
    cakeLabels.push({
      name: item,
      y: makesLeads[i]
    })
    return false;
  })


  let options;

  if(type === 'column'){
    options = {
      chart: {
      type: 'column',
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
      column: {
        borderWidth: 0,
        color: theme.palette.primary.main,
      colors: colores,

      },
      line: {
        borderWidth: 1,
        color: theme.palette.primary.main
      },
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
            return Highcharts.numberFormat(this.y,0);
          }
        }
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
        data: finalSerie,
      }
    ]
  };

  }else{
    options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
          borderWidth: 0,
            allowPointSelect: true,
            cursor: 'pointer',
            colors: colores,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
            }
        }
    },
    series: [{
        name: 'Leads',
        colorByPoint: true,
        data: cakeLabels
    }]
    }
  }
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
