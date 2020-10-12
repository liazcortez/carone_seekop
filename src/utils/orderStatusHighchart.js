const orderArray = (data, theme) => {

    let result = [];
    const order = ['new','documentation','sold'];

    order.map((status ) => 
        data.map(item => 
            {
                if(item.name === 'new'){
                    item.color = theme.palette.success.main;
                }
                if(item.name === 'sold'){
                    item.color = theme.palette.error.main;
                    
                }
                if(item.name === 'documentation'){
                    item.color = theme.palette.warning.main;
                    
                }
                if(item.name === status){
                    result.push(item)
                }

                
            
            }
        )
    );

    result.map( res =>{
        res.name = res.name.charAt(0).toUpperCase() + res.name.slice(1)
        return false;
    });

    return result;

};

export default orderArray;