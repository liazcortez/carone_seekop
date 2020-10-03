const orderArray = (data) => {

    let result = [];
    const order = ['new','documentation','sold'];

    order.map((status ) => 
        data.map(item => 
            item.label === status ? result.push(item) : false
        )
    );

    result.map( res =>{
        res.label = res.label.charAt(0).toUpperCase() + res.label.slice(1)
        return false;
    });

    return result;

};

export default orderArray;