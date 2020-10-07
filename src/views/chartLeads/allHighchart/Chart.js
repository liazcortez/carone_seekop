import React from 'react';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';
import leadsPerMake from 'src/utils/leadsPerMake';
import storesToCount from 'src/utils/storesToCount';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import makesToCount from 'src/utils/makesToCount';
import separateLeadsByMake from 'src/utils/separateLeadsByMake'
import leadsPerStore from 'src/utils/leadsPerStore';
import generateColor from 'src/utils/createColorsGradient';
import Drilldown from 'highcharts/modules/drilldown';

import leadsPerTemperature from 'src/utils/leadsPerTemperature';
import leadsPerTemperatureStore from 'src/utils/leadsPerTemperatureStore';
// import warmPerMake from 'src/utils/warmPerMake';
// import hotPerMake from 'src/utils/hotPerMake';


Drilldown(Highcharts);
const LineChart = ({ leads, setDrill, type}) => {
  const theme = useTheme();

  let arrayData = [];
  let arrayDataColds = [];
  let arrayDataHots = [];
  let arrayDataWarms = [];
  let arrayDrillData = [];


  let arrayDrillDataPie = [];


  const arrMakes = makesToCount(leads);
  const uniqueMakes = _.uniqBy(arrMakes);
  const makesLeads = leadsPerMake(arrMakes);
  const arrayLeadsByMakes = separateLeadsByMake(leads, uniqueMakes);
  let models;
  let uniqueModels;
  let quant;
  let quantCold;
  let quantHot;
  let quantWarm;

  const colds = leadsPerTemperature(leads, uniqueMakes, 'cold');
  const warms = leadsPerTemperature(leads, uniqueMakes, 'warm');
  const hots = leadsPerTemperature(leads, uniqueMakes, 'hot');

  let colores = generateColor('#ffffff', theme.palette.primary.main, 12)

  uniqueMakes.map( (make, i) =>{

    arrayData.push({
      name: make,
      y: makesLeads[i],
      drilldown: make
    })

    arrayDrillDataPie.push(
      {
        id: make,
        name: 'Leads',
        data: []
      })

    arrayDrillData.push(
      {
        showInLegend: false,  
        id: make,
        name: 'Leads',
        data: []
      })
   return false;
  })

  uniqueMakes.map( (make, i) =>{

    arrayDataColds.push({
      name: make,
      y: colds[i],
      drilldown: make
    })

    arrayDataWarms.push({
      name: make,
      y: warms[i],
      drilldown: make
    })

    arrayDataHots.push({
      name: make,
      y: hots[i],
      drilldown: make
    })
   return false;
  })

  arrayLeadsByMakes.map( (leadsA, i)=>{
    models = storesToCount(leadsA);
    uniqueModels = _.uniqBy(models);
    quant = leadsPerStore(leads, uniqueModels);
    quantCold = leadsPerTemperatureStore(leads, uniqueModels, 'cold');
    quantHot = leadsPerTemperatureStore(leads, uniqueModels, 'hot');
    quantWarm = leadsPerTemperatureStore(leads, uniqueModels, 'warm');

    if(uniqueModels !== undefined){
      uniqueModels.map((item, i) =>{

        
        arrayDrillData.map( (b, j)=>{
          if(b.id === leadsA[0].vehicle.make.name){
            b.data.push(
              {
                name: uniqueModels[i], 
                y:quantCold[i],
                color: '#4bb5d7'
              },
              {
                name: uniqueModels[i], 
                y:quantWarm[i],
                color: '#f2a94c',
              },
              {
                name: uniqueModels[i], 
                y:quantHot[i],
                color: '#e16a6b',
              },
          )
          }
          return false;
        })


        arrayDrillDataPie.map( (b, j)=>{
          if(b.id === leadsA[0].vehicle.make.name){
            b.data.push(
              {
                name: uniqueModels[i], 
                y:quant[i],
              }
          )
          }
          return false;
        })

        return false;
      })
    }

    return false;

  })


  let options;

  if(type === 'pie'){
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
        colors: colores,
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
      series: arrayDrillDataPie
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
          stacking: 'normal',
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.percentage:,.0f}% ({point.y: ,.0f})<br/>Total: {point.total}',
              style: {
                fontFamily: 'Helvetica, sans-serif',
                fontSize: '12px',
                fontWeight: 'normal',
                textShadow: 'none',
            },
          }
        },
        series: {
          dataLabels: { 
            enabled: true, 
            inside: true,
            color: 'rgba(255,255,255,1)',
            style: {
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '12px',
              fontWeight: 'normal',
              textShadow: 'none',
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
        column: {
          stacking: 'normal',
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.percentage:,.0f}% ({point.y: ,.0f})',
              style: {
                fontFamily: 'Helvetica, sans-serif',
                fontSize: '12px',
                fontWeight: 'normal',
                textShadow: 'none',
            },
          }
        },
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
          name: 'Cold',
          data: arrayDataColds,
          color: '#4bb5d7'
        },
        {
          name: 'Warm',
          data: arrayDataWarms,
          color: '#f2a94c'
        },
        {
          name: 'Hot',
          data: arrayDataHots,
          color: '#e16a6b',
        },
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
