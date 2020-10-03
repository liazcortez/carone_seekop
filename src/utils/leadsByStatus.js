import "moment-timezone";
import _ from "lodash";

const leadsPerMonth = (data, months, id) => {

    const leads = months.map(category => _.filter(data, function(lead) { 
        if (lead.vehicle.model === category && lead.status === id) return lead 
      }).length);

    return leads;
};

export default leadsPerMonth;