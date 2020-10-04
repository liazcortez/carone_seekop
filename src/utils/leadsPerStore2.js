import "moment-timezone";
import _ from "lodash";

const leadsPerStore = (data, cat) => {


    const leads = cat.map(category => _.filter(data, function(lead) { 
        if ((lead.store.make.name + ' ' + lead.store.name) === category) return lead 
      }).length);

    return leads;
};

export default leadsPerStore;