//import useLead from 'src/hooks/useLead';
import moment from 'moment';

const filterCases = (filter) =>{

  switch (filter) {
    case 'today':
      getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}`);
      return 'LT';

      break;
    case 'yesterday':
      getLeadsChart(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}`);
      return 'LT';

      break;
    case 'month':
      getLeadsChart(`?createdAt[gte]=${moment().startOf('month')._d}`);
      return 'D-MMM';

      break;
    case '6month':
      getLeadsChart(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}`);
      return 'MMMM';

      break;
    case 'year':
      getLeadsChart(`?createdAt[gte]=${moment().startOf('year')._d}`);
      return 'MMMM';
      break;
  
    default:
      break;
  }
}

export default filterCases;