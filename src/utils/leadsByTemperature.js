import "moment-timezone";
import _ from "lodash";

const leadsPerMonth = (data, id) => {
    const leads = _.filter(data, function(lead) { 
        if (lead.rating === id) return lead
      }).length

    return leads;
};

export default leadsPerMonth;