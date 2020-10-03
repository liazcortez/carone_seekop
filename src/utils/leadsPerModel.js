import "moment-timezone";
import _ from "lodash";

const leadsPerMake = (data, cat) => {

    const leads = cat.map(category => _.filter(data, function(lead) { 
        if (lead.vehicle.model === category) return lead 
      }).length);

    return leads;
};

export default leadsPerMake;