import moment from "moment";
import "moment-timezone";
import _ from "lodash";

const datesFormat = (data, format) => {
  const newarr = data.sort((a, b) => moment(a.createdAt).diff(b.createdAt));

  const itemMonths = newarr.map(item => item.createdAt);

  const formatMonths = itemMonths.map(item => moment(item).format(format));

  return _.uniqBy(formatMonths);

};

export default datesFormat;