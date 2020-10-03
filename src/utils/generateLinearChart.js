import "moment-timezone";
import leadsPerMonth from './leadsPerMonth';
import datesFormat from './datesFormat';
import salesPerMonth from './leadsSoldPerMonth';


const generateChart = (data, filter) => {
  const months = datesFormat(data, filter)

  const series = [{
    series: [{
      name: 'Leads', 
      data: leadsPerMonth(data, months, filter)
    },
    {
      name: 'Sales', 
      data: salesPerMonth(data, months, filter)
    }]
  },
  {
    months: months
  }];

  
  return series;
};

export default generateChart;