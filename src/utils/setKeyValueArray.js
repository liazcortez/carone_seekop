import orderStatus from './orderStatusArray';

const KeyValue = (keys, values) => {

    let result = [];

    keys.map((key, i) => {
        const obj = {
            label: key,
            value: values[i]
        };
        result.push(obj)
    return false
    });

    return orderStatus(result);

};

export default KeyValue;