import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMonth from 'src/utils/leadsPerMonth';
import datesFormat from 'src/utils/datesFormat';
import salesPerMonth from 'src/utils/leadsSoldPerMonth';
import salesPerMonth2 from 'src/utils/leadsSoldPerMonth2';
import makesToCount from 'src/utils/makesToCount';
import leadsPerMake from 'src/utils/leadsPerMake';
import _ from 'lodash'
import '../styles.css'


import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const LineChart = ({ leads, filter, type, ids, idsS, labels}) => {
  const theme = useTheme();

  let fix = [];
  let fix2 = [];

  let arrMakes;
  let categories;
  let makesLeads;
  let salesMonth;
  
  fix.push(...ids);
  fix2.push(...idsS);

  //1 all
  //0 unique

  if(labels === 0){
    arrMakes = datesFormat(leads, filter);

    categories = _.uniqBy(arrMakes);
    
    makesLeads = leadsPerMonth(leads, categories, filter);

    salesMonth = salesPerMonth2(leads, categories, filter);

  }else{
    arrMakes = makesToCount(leads);

    categories = _.uniqBy(arrMakes);
    
    makesLeads = leadsPerMake(arrMakes);

    salesMonth = salesPerMonth(leads, categories, filter);

  }

  

  // const categories = datesFormat(leads, filter);

  // const leadsMonth = leadsPerMonth(leads, categories, filter);

  const options = {
    chart: {
      type: type,
      backgroundColor: theme.palette.background.paper,
      style: {
        color: theme.palette.divider
      },
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
        color: theme.palette.primary.main
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
          shape: 'callout',
          borderColor: 'rgba(0,0,0,0.5)',
          color: 'rgba(1,1,1,0.75)',
          borderWidth: 0.5,
          backgroundColor:'rgba(255,255,255,0.8)',
          borderRadius: 5,
          y: -10,
          style: {
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: 'normal',
            textShadow: 'none',

          },
          formatter: function() {
            return '<strong>'+this.series.name+'</strong>'
                        +'<br/>Make: <strong>'+ this.x+'</strong>'
                  +'<br/>Total: <strong>'+ Highcharts.numberFormat(this.y,0)+'</strong>';
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
        data: makesLeads,
        color: '#1f87e6',
      },
      {
        name: 'Sales',
        data: salesMonth,
        color: '#ff5c7c',
      }
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
