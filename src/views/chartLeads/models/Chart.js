import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';

import leadsPerMake from 'src/utils/leadsPerMake';

import modelsToCount from 'src/utils/modelsToCount';

import _ from "lodash";

const LineChart = ({ leads, filter, type }) => {
  const theme = useTheme();

  const arrMakes = modelsToCount(leads);

  const categories = _.uniqBy(arrMakes);
  
  const makesLeads = leadsPerMake(arrMakes);
  let chart;
  
  if(type === 'bar'){
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
        offsetY: -20,
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
