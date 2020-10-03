import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMonth from 'src/utils/leadsPerMonth';
import datesFormat from 'src/utils/datesFormat';
import salesPerMonth from 'src/utils/leadsSoldPerMonth';
import salesPerMonth2 from 'src/utils/leadsSoldPerMonth2';
import makesToCount from 'src/utils/makesToCount';
import leadsPerMake from 'src/utils/leadsPerMake';
import _ from 'lodash'

const LineChart = ({ leads, filter, type, ids, idsS, labels, showInfo}) => {
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
      colors: ['#1f87e6', '#ff5c7c'],
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
        lineCap: 'butt'
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
        },
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
          opposite: true,
          seriesName: 'Leads'
        }
      ]
    },
    series: [
      {
        name: 'Leads',
        data: makesLeads,
      },
      {
        name: 'Sales',
        data: salesMonth,
      }
    ]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
          Leads
        </Typography>
        <Chart type={type} height="300" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
