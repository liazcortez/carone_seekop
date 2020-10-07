import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';
import leadsPerMake from 'src/utils/leadsPerMake';
import modelsToCount from 'src/utils/modelsToCount';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import makesToCount from 'src/utils/makesToCount';
import separateLeadsByMake from 'src/utils/separateLeadsByMake'
import leadsPerModel from 'src/utils/leadsPerModel';
import generateColor from 'src/utils/createColorsGradient';
import Drilldown from 'highcharts/modules/drilldown';

Drilldown(Highcharts);
const LineChart = ({ leads , setDrill, type}) => {
  const theme = useTheme();

  let arrayData = [];
  let arrayDrillData = [];

  let colors = generateColor('#ffffff', theme.palette.primary.main, 12)

  const arrMakes = makesToCount(leads);
  const uniqueMakes = _.uniqBy(arrMakes);
  const makesLeads = leadsPerMake(arrMakes);
  const arrayLeadsByMakes = separateLeadsByMake(leads, uniqueMakes);
  let models;
  let uniqueModels;
  let quant;

  uniqueMakes.map( (make, i) =>{

    arrayData.push({
      name: make,
      y: makesLeads[i],
      drilldown: make
    })

    arrayDrillData.push({
      id: make,
      name: 'Leads',
      data: []
    })
   return false;
  })

  arrayLeadsByMakes.map( (leadsA, i)=>{
    models = modelsToCount(leadsA);
    uniqueModels = _.uniqBy(models);
    quant = leadsPerModel(leads, uniqueModels);

    if(uniqueModels !== undefined){
      uniqueModels.map((item, i) =>{

        arrayDrillData.map( (b, j)=>{
          if(b.id === leadsA[0].vehicle.make.name){
            b.data.push([uniqueModels[i], quant[i]])
          }
          return false;

        })
        return false;
      })
    }

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
      },
      events: {
        drilldown: function (e) {
          setDrill(true)
        },
        drillupall: function(e){
          setDrill(false)
        }

      }
    },
    legend: {
      itemStyle: {
          color: theme.palette.text.primary,
      }
    },
    tooltip: {
      enabled: true
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
          color: 'rgba(255,255,255,1)',
          y: -10,
          style: {
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: 'normal',
            textShadow: 'none',

          },
          formatter: function() {
            return Highcharts.numberFormat(this.y,0)
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
      type: 'category',
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
    drilldown: {
      activeAxisLabelStyle: {
        textDecoration: 'none',
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '12px',
        color: theme.palette.text.primary,
      },
      activeDataLabelStyle: {
        textDecoration: 'none',
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '12px',
        color: theme.palette.text.primary,
      },
      series: arrayDrillData
    },
    series: [
      {
        name: 'Leads',
        data: arrayData,
        color: theme.palette.primary.main,
      }
    ]
  };  
  }else{
    options = {
      chart: {
        type: 'pie',
        backgroundColor: theme.palette.background.paper,
        style: {
          color: theme.palette.divider
        },
        events: {
          drilldown: function (e) {
            setDrill(true)
          },
          drillupall: function(e){
            setDrill(false)
          }
        }
      },
      legend: {
        itemStyle: {
            color: theme.palette.text.primary,
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      plotOptions: {
        pie: {
          borderWidth: 0,
          allowPointSelect: true,
          cursor: 'pointer',
          colors: colors,
          dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.2f} %'
          }
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
              return Highcharts.numberFormat(this.y,0)
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
        type: 'category',
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
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          fontFamily: 'Helvetica, sans-serif',
          fontSize: '12px',
          color: theme.palette.text.primary,
        },
        activeDataLabelStyle: {
          textDecoration: 'none',
          fontFamily: 'Helvetica, sans-serif',
          fontSize: '12px',
          color: theme.palette.text.primary,
        },
        series: arrayDrillData
      },
      series: [
        {
          name: 'Leads',
          data: arrayData,
          color: theme.palette.primary.main,
        }
      ]
    };
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
