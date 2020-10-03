import React from 'react';
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { Card, CardContent, Typography, useTheme } from '@material-ui/core';
import fusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';
import leadsPerStatus from 'src/utils/leadsPerStatus';
import statusToCount from 'src/utils/statusToCount';
import setKeyValueArray from 'src/utils/setKeyValueArray';

import _ from "lodash";

const PyramidChart = ({ leads }) => {
  const theme = useTheme();
  
  FusionCharts.addDep(fusionTheme);
  const arrStatus = statusToCount(leads);

  const categories = _.uniqBy(arrStatus);

  const statusLeads = leadsPerStatus(arrStatus);

  const dataFinal = setKeyValueArray(categories,statusLeads);

  charts(FusionCharts);

  const dataSource = {
    chart: {
      //caption: "Leads",
      //subcaption: "By status",
      decimals: "1",
      showvalues: "1",
      plottooltext:
      "$label: <b>$dataValue</b>",
      plotfillalpha: "70",
      theme: "fusion",
      streamlineddata: "0",
      usesameslantangle: "0",
      showpercentvalues: "1",
      bgColor: theme.palette.background.default,
      labelFontColor: theme.palette.text.secondary,
      paletteColors:[theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
      captionFontColor: theme.palette.text.secondary,
      labelFontSize: 20,
    },
    data: dataFinal
  };
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="textPrimary">
          Leads by Status
        </Typography>
        <ReactFusioncharts
          type="funnel"
          width="100%"
          height="600"
          dataFormat="JSON"
          dataSource={dataSource}
          setTransparent
        />
     </CardContent>
    </Card>
    );
};

export default PyramidChart;