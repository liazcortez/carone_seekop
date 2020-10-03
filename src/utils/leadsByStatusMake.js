import "moment-timezone";
import _ from "lodash";

const leadsPerMonth = (data, months, id) => {

    const leads = months.map(category => _.filter(data, function(lead) { 
        if (lead.vehicle.make.name === category && lead.status._id === id) return lead 
      }).length);

    return leads;
};

export default leadsPerMonth;