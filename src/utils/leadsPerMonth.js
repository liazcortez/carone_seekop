import moment from "moment";
import "moment-timezone";
import _ from "lodash";

const leadsPerMonth = (data, months, filter) => {
    const leads = months.map(category => _.filter(data, function(lead) { 
        if (moment(lead.createdAt).format(filter) === category) return lead 
      }).length);

    return leads;
};

export default leadsPerMonth;