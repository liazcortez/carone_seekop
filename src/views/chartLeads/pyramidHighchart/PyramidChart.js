import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';
import leadsPerStatus from 'src/utils/leadsPerStatus';
import statusToCount from 'src/utils/statusToCount';
import setKeyValueArray from 'src/utils/setKeyValueArray';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Funnel from 'highcharts/modules/funnel';

import _ from "lodash";

Funnel(Highcharts);

const PyramidChart = ({ leads }) => {
  const theme = useTheme();
  
  const arrStatus = statusToCount(leads);

  const categories = _.uniqBy(arrStatus);

  const statusLeads = leadsPerStatus(arrStatus);

  const dataFinal = setKeyValueArray(categories, statusLeads);

  let data = [];

  dataFinal.map( dataF =>{
    data.push([dataF.label, dataF.value])
    return false;
  })


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
    legend: {
        itemStyle: {
            color: theme.palette.text.primary,
        }
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
                overflow: 'none',
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
        data: data,
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
          Leads by Status
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={options} />
     </CardContent>
    </Card>
    );
};

export default PyramidChart;