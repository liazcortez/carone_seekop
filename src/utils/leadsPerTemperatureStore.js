import "moment-timezone";
import _ from "lodash";

const TemperatureLeads = (data, categories, type) => {

    let obj = [];

    const leads = categories.map(category => _.filter(data, function(lead) { 
        if (lead && lead.store && (lead.store.name === category) && lead.rating === type) return lead
      }).length);
    return leads;
};

export default TemperatureLeads;