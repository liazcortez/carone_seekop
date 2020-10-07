import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';
import makesToCount from 'src/utils/makesToCount';
import datesFormat from 'src/utils/datesFormat'; 
import leadsPerMonth from 'src/utils/leadsPerMonth';
import _ from "lodash";

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
      colors: ['#8a85ff'],
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
        data: makesLeads
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
