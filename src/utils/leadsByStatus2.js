import "moment-timezone";
import _ from "lodash";
import moment from 'moment';
const leadsPerMonth = (data, months, id, filter) => {
    const leads = months.map(category => _.filter(data, function(lead) { 
        if (moment(lead.createdAt).format(filter) === category && lead.status._id === id) return lead 
      }).length);

    return leads;
};

export default leadsPerMonth;