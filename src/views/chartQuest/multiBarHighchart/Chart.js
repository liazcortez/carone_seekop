import React from 'react';
import { Card, CardContent, Typography, useTheme, makeStyles } from '@material-ui/core';
import generateColor from 'src/utils/createColorsGradient';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
  containerSync: {
    float: 'right',
  },
  sync: {
    padding: '5px',
    fontSize: '30px',
    cursor: 'pointer',
    right: 10,
  },
}));

const LineChart = ({ leads, type, reload }) => {
  const theme = useTheme();
  const classes = useStyles();

  const { t } = useTranslation()
  
  let colores = generateColor('#ffffff', theme.palette.primary.main, 50)
  
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
      enabled: true
    },
    plotOptions: {
      series: {
        dataLabels: { 
          enabled: true, 
          inside: false,
          y: -1,
          color: 'rgba(255,255,255,1)',
          style: {
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: 'normal',
            textShadow: 'none',

          },
          formatter: function() {
            return  Highcharts.numberFormat(this.y,0)
          }
        }
      },
      column: {
        scrollbar: {
          enabled: true
      },
      tickLength: 0,
        borderWidth: 0,
        color: theme.palette.primary.main,
        margin: 1,
      },
    },
    title: {
      text: '',
      style: {
        color: theme.palette.divider
      }
    },
    xAxis: {
      scrollbar: {
        enabled: true
      },
      categories: leads && leads[0] ? leads[0] : [],
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
        data: leads && leads[1] ? leads[1] : []
      },
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
    categories: leads && leads[0] ? leads[0] : [],
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
        data: leads && leads[2] ? leads[2] : []
    }]
    }
  }

  return (
    <Card>
      <CardContent>

        <Typography variant="h4" color="textPrimary">
        {t("Charts.Models")}
        <div className={classes.containerSync}>
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={reload}/>
        </div> 
        </Typography>

          <HighchartsReact highcharts={Highcharts} options={options} />

      </CardContent>
    </Card>
  );
};

export default LineChart;
