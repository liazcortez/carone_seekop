import "moment-timezone";
import _ from "lodash";

const leadsPerMake = (data, filter) => {

    const leads = filter.map(category => _.filter(data, function(lead) { 
        if ((lead && lead.agent && lead.agent.store && lead.agent.store.make && lead.agent.store.make.name + ' ' + lead.agent.store.name) === category) return lead 
      }));

    return leads;
};

export default leadsPerMake;