import "moment-timezone";
import _ from "lodash";

const leadsPerMake = (data, filter) => {

    const leads = filter.map(category => _.filter(data, function(lead) { 
        if (lead.vehicle.make.name === category) return lead 
      }));

    return leads;
};

export default leadsPerMake;