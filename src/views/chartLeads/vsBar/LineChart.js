import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Typography, useTheme, colors } from '@material-ui/core';
import leadsByStatus from 'src/utils/leadsByStatus3';
import leadsBySource from 'src/utils/leadsBySource3';
import leadsByTemperature from 'src/utils/leadsByTemperature';
import orderstatus from 'src/utils/orderStatus';
import _ from "lodash";

const LineChart = ({leads, categories,ids, idsS, showInfo}) => {
  const theme = useTheme();  

  let fix = [];
  let fix2 = [];
  let fix3 = ['hot','warm','cold','none'];
  let makesLeads = [];
  let seriesSources = [];
  let seriesStatuses = [];
  let seriesRating = [];
  let arrayInformation = [];
  let colorFinal = [];
  let arrayL = [];
  let cat = [];    
  let aux = [];
  let finalTotalSource = [];
  let finalTotalStatus = [];
  let finalTotalRating = [];

  let finalTotalSourceDesg = [];
  let finalTotalStatusDesg = [];

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
              data: finalTotalRating
            }
          )
  
          finalTotalRating=[]
        }
      })
    }

    if(ids){
      fix.map( item => {
        if(categories.length <= 0) {

        let x =leadsByStatus(arr, item[Object.keys(item)[0]]);
        finalTotalStatus.push(x)  

        seriesStatuses.push(
          {
            name: Object.keys(item)[0],
            data: finalTotalStatus
          }
        )

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
              data: finalTotalSource
            }
          )

          finalTotalSource=[]
        }
      })
    }

   

    makesLeads.push(arr.length)

  
   
  })

  if(categories.length > 0){
    
    if(showInfo === 'temperatures'){
      fix3.map( (item) => {

        leads.map(arr => {
          let cont = leadsByTemperature(arr, item);
          aux.push(cont)
        })

      seriesRating.push({
          name: item,
          data: aux
        })

        aux = []
      })
    }


    if(idsS){
      fix2.map( (item) => {

        leads.map(arr => {
          let cont = leadsBySource(arr, item[Object.keys(item)[0]]);
          aux.push(cont)
        })

      seriesSources.push({
          name: Object.keys(item)[0],
          data: aux
        })

        aux = []
      })
    }

    if(ids){
      fix.map( (item) => {

        leads.map(arr => {
          let cont = leadsByStatus(arr, item[Object.keys(item)[0]]);
          aux.push(cont)
        })

      seriesStatuses.push({
          name: Object.keys(item)[0],
          data: aux
        })

        aux = []
      })
    }
  }

  seriesStatuses = orderstatus(seriesStatuses);

  if(showInfo === 'statuses'){
    arrayInformation.push(...seriesStatuses);
    colorFinal = {colors: [colors.blue['500'], theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, theme.palette.primary.main]};
  }else if(showInfo === 'sources'){
    arrayInformation.push(...seriesSources)
    colorFinal = {
      colors: [
              theme.palette.primary.main,
              colors.deepPurple['700'],
              colors.deepPurple['600'],
              colors.deepPurple['500'],
              colors.deepPurple['400'], 
              colors.deepPurple['300'], 
              colors.deepPurple['200'], 
              colors.deepPurple['100'], 
              colors.deepPurple['50'], 
            ]};
  }else{
    arrayInformation.push(...seriesRating);
    colorFinal = {colors: [colors.blue['400'], '#e16a6b','#f2a94c','#4bb5d7', theme.palette.primary.main]};
  }

  if(categories.length <= 0){
    categories = ['All']
  }
  const chart = {
    options: {
      chart: {
        background: theme.palette.background.paper,
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: false,
       
      },
      ...colorFinal,
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
      },
      theme: {
        mode: theme.palette.type
      },
      tooltip: {
        theme: theme.palette.type
      },
      xaxis: {
        tooltip: {
          enabled: false
        },
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
          tooltip: {
            enabled: false
          },
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

        }
      ]
    },
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
          <Chart type='bar' height="500" {...chart} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
