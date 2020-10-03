import _ from "lodash";

const leadsPerStatus = (data) => {

    const uniqueStatus = _.uniqBy(data);

    const leads = uniqueStatus.map(category => _.filter(data, function(lead) { 
        if (lead === category) return lead 
      }).length);

    return leads;
};

export default leadsPerStatus;