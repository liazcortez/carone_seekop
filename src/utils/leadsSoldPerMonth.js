import "moment-timezone";
import _ from "lodash";

const leadsPerMonth = (data, months, filter) => {

    const leads = months.map(category => _.filter(data, function(lead) { 
        if (lead.vehicle.make.name === category && lead.status.name === 'sold') return lead 
      }).length);

    return leads;
};

export default leadsPerMonth;