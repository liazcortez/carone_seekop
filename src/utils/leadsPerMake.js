import "moment-timezone";
import _ from "lodash";

const leadsPerMake = (data) => {

    const uniqueMakes = _.uniqBy(data);

    const leads = uniqueMakes.map(category => _.filter(data, function(lead) { 
        if (lead === category) return lead 
      }).length);

    return leads;
};

export default leadsPerMake;