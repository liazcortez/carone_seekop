import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';
import leadsByStatus from 'src/utils/leadsByStatus3';
import leadsBySource from 'src/utils/leadsBySource3';
import leadsByTemperature from 'src/utils/leadsByTemperature';
import orderStatus from 'src/utils/orderStatusHighchart';
import _ from "lodash";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const LineChart = ({leads, categories,ids, idsS, showInfo}) => {
  const theme = useTheme();  

  let fix = [];
  let fix2 = [];
  let fix3 = ['hot','warm','cold','none'];
  let arrMakes =[];
  let makesLeads = [];
  let seriesSources = [];
  let seriesStatuses = [];
  let seriesRating = [];
  let cont = 0;
  let arrayInformation = [];
  let FinalMakesLeads = []
  let colorFinal = [];
  let arrayL = [];
  let cat = [];    
  let aux = [];
  let finalTotalSource = [];
  let finalTotalStatus = [];
  let finalTotalRating = [];

  const statusColors= [colors.blue['500'], theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]
  const ratingColors= [colors.blue['500'], '#e16a6b','#f2a94c','#4bb5d7', theme.palette.primary.main]
  const sourceColors= [
    colors.deepPurple['700'],
    colors.deepPurple['600'],
    colors.deepPurple['500'],
    colors.deepPurple['400'], 
    colors.deepPurple['300'], 
    colors.deepPurple['200'], 
    colors.deepPurple['100'], 
    colors.deepPurple['50'] 
  ]

  if(!leads){
    leads=[]
  }

  fix.push(...ids);
  fix2.push(...idsS);

  leads.map( (arr, i) => {

    if(showInfo === 'temperatures'){
        fix3.map( (item, index) => {
          if(categories.length <= 0) {
  
          let x = leadsByTemperature(arr, item);
          finalTotalRating.push(x)  
  
          seriesRating.push(
            {
              name: item,
              data: finalTotalRating,
              color: ratingColors[cont]

            }
          )
          cont++
          finalTotalRating=[]
        }
        
      })
    }
    cont = 0;
    if(ids){
      fix.map( item => {
        if(categories.length <= 0) {

        let x =leadsByStatus(arr, item[Object.keys(item)[0]]);
        finalTotalStatus.push(x)  

        seriesStatuses.push(
          {
            name: Object.keys(item)[0],
            data: finalTotalStatus,

          }
        )
        cont++
        finalTotalStatus=[]
      }
    })
    }

  
    if(idsS){
        fix2.map( item => {
          if(categories.length <= 0) {
          let x =leadsBySource(arr, item[Object.keys(item)[0]]);
          finalTotalSource.push(x)  
          seriesSources.push(
            {
              name: Object.keys(item)[0],
              data: finalTotalSource,
              color: sourceColors[cont]
            }
          )
          cont++;
          finalTotalSource=[]
        }

      }
      )
    }

   

    makesLeads.push(arr.length)

  
   
  })
  cont = 0;

  if(categories.length > 0){
    
    if(showInfo === 'temperatures'){
      fix3.map( (item) => {

        leads.map(arr => {
          let cont = leadsByTemperature(arr, item);
          aux.push(cont)
        })

      seriesRating.push({
          name: item,
          data: aux,
          color: ratingColors[cont]
        })

        aux = []
        cont++;
      })
    }

    cont = 0;

    if(idsS){
      fix2.map( (item) => {

        leads.map(arr => {
          let cont = leadsBySource(arr, item[Object.keys(item)[0]]);
          aux.push(cont)
        })
        cont = 0;
      seriesSources.push({
          name: Object.keys(item)[0],
          data: aux,
          color: sourceColors[cont]

        })
        cont++;
        aux = []
      })
    }
    cont = 0;

    if(ids){
      fix.map( (item) => {

        leads.map(arr => {
          let cont = leadsByStatus(arr, item[Object.keys(item)[0]]);
          aux.push(cont)
        })

      seriesStatuses.push({
          name: Object.keys(item)[0],
          data: aux,
          color: colors.blue['500']

        })
        cont++;
        aux = []
      })
    }
  }

  seriesStatuses = orderStatus(seriesStatuses, theme)
  if(showInfo === 'statuses'){
    arrayInformation.push(...seriesStatuses);
  }else if(showInfo === 'sources'){
    arrayInformation.push(...seriesSources)

  }else{
    arrayInformation.push(...seriesRating);
  }

  if(categories.length <= 0){
    categories = ['All']
  }
  
  const options = {
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
    enabled: true
  },
  plotOptions: {
    column: {
      borderWidth: 0,
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
      data: makesLeads ? makesLeads : [0]
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
