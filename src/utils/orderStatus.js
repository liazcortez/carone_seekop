const orderArray = (data) => {

    let result = [];
    const order = ['new','documentation','sold'];

    order.map((status ) => 
        data.map(item => 
            item.name === status ? result.push(item) : false
        )
    );

    result.map( res =>{
        res.name = res.name.charAt(0).toUpperCase() + res.name.slice(1)
        return false;
    });

    return result;

};

export default orderArray;