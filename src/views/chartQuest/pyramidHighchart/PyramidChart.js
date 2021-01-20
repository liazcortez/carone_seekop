import React from 'react';
import { Card, CardContent, Typography, useTheme, makeStyles } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Funnel from 'highcharts/modules/funnel';
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

Funnel(Highcharts);

const PyramidChart = ({ leads, reload }) => {
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();
  
  const options = {
    chart: {
        type: 'funnel',
        backgroundColor: theme.palette.background.paper,
        style: {
            color: theme.palette.divider,
            border: 'none'
        }
    },
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    title: {
        text: ''
    },
    plotOptions: {
        funnel: {
            borderWidth: 0
        },
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name} leads</b> <br> Total: {point.percentage:,.0f}% ({point.y: ,.0f})',
                softConnector: true,
                crop: true,
                borderColor: 'rgba(0,0,0,0.5)',
                color: 'rgba(1,1,1,0.75)',
                borderWidth: 0.5,
                backgroundColor:'rgba(255,255,255,0.8)',
                borderRadius: 5,
                style: {
                    fontFamily: 'Helvetica, sans-serif',
                    fontSize: '12px',
                    fontWeight: 'normal',
                    textShadow: 'none',
                },
            },
            center: ['50%', '50%'],
            neckWidth: '30%',
            neckHeight: '25%',
            width: '50%'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Leads',
        data: leads && leads[0] ? leads[0] : [],
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            inside: true
                        },
                        center: ['50%', '50%'],
                        width: '100%'
                    }
                }
            }
        }]
    }
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
        {t("Charts.Lbst")}
        <div className={classes.containerSync}>
            <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={reload}/>
        </div> 
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={options} />
     </CardContent>
    </Card>
    );
};

export default PyramidChart;