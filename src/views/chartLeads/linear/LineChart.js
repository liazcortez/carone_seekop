import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMonth from 'src/utils/leadsPerMonth';
import datesFormat from 'src/utils/datesFormat';
import salesPerMonth2 from 'src/utils/leadsSoldPerMonth2';
import _ from 'lodash'

const LineChart = ({ leads, filter, type, ids, idsS, showInfo}) => {
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

    arrMakes = datesFormat(leads, filter);

    categories = _.uniqBy(arrMakes);
    
    makesLeads = leadsPerMonth(leads, categories, filter);

    salesMonth = salesPerMonth2(leads, categories, filter);


  // const categories = datesFormat(leads, filter);

  // const leadsMonth = leadsPerMonth(leads, categories, filter);

  let chart; 
  if(type==='bar'){

   chart = {
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
  }else{
    chart = {

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
        dataLabels: {
          enabled: true,
          formatter: function(value, { seriesIndex, dataPointIndex, w }) {
            return [w.config.labels[seriesIndex], value.toFixed(2) + '%', '( ' +
            w.globals.seriesTotals.reduce((a, b) => {
              return a + b
            }, 0) + ' )'
            ]
          },  
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, sans-serif',
            fontWeight: '700',
            colors: ["#fff"]
          },
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
  }

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
