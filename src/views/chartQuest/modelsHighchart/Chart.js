import React from 'react';
import { Card, CardContent, Typography, useTheme, makeStyles } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import generateColor from 'src/utils/createColorsGradient';
import Drilldown from 'highcharts/modules/drilldown';
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

let contar = 0;
Drilldown(Highcharts);
const LineChart = ({ leads , setDrill, type, reload, reloadBool }) => {

  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  
  let colors = generateColor('#ffffff', theme.palette.primary.main, 25)

  let options;

  if(!leads[0]){
    contar = 0;
  }

  contar++;

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
          crop: true,
          color: 'rgba(255,255,255,1)',
          y: 0,
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
      series: leads && leads[1] && ((reloadBool && contar > 1)||(!reloadBool && contar > 2)) ? leads[1] : []
    },
    series: [
      {
        name: 'Leads',
        data: leads && leads[0] && ((reloadBool && contar > 1)||(!reloadBool && contar > 2)) ? leads[0] : [],
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
          animation: false,
          dataLabels: { 
            enabled: true, 
            inside: false,
          crop: true,
            color: 'rgba(255,255,255,1)',
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
        series: leads && leads[1] && ((reloadBool && contar > 1)||(!reloadBool && contar > 2)) ? leads[1] : [] 
      },
      series: [
        {
          name: 'Leads',
          data: leads && leads[0] && ((reloadBool && contar > 1)||(!reloadBool && contar > 2)) ? leads[0] : [],
          color: theme.palette.primary.main,
        }
      ]
    };
  }

  return (
    <Card style={{height: '450px'}}>
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
